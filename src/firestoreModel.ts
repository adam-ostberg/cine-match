import { db } from "./firebaseConfig.ts";
import { MovieModel } from "./MovieModel.ts";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, runTransaction, onSnapshot, getDocs, where, collection, query, writeBatch, arrayRemove } from "firebase/firestore";
import type { SessionModel, UserInfoType } from "./SessionModel.ts";
import { type MatchType, UserModel } from "./UserModel.ts";

const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";

export type UserType = {
    username: string,
    email: string,
    createdAt: string,
    likes: string[],
    dislikes: string[],
    sessions: string[]
};

// Create a new session in Firebase and return the session ID
export async function createSession(user: UserModel) {
    // First check if the user is logged in
    if (!user.currentUser) {
        alert("You must be logged in to create a session.");
        return;
    }

    // Generate a random 6-digit code or use a UUID
    const sessionId = Math.floor(100000 + Math.random() * 900000).toString();
    
    const docRef = doc(db, "sessions", sessionId);
    // Try to create the doc in firestore, throw error if it fails
    try {
        await setDoc(docRef, {
            status: "waiting",
            hostId: user.currentUser.uid,
            match: null,
            created: new Date(),
            participants: [{userId: user.currentUser.uid, username: user.username}],
        });
        console.log("Session created successfully with ID:", sessionId);
    } catch (error) {
        console.error("Error creating session:", error);
        throw error;
    }

    // Set and return the session ID
    user.setCurrentSessionId(sessionId);
    console.log("Session created with ID: ", sessionId);
    return sessionId;
}

export async function joinSession(userModel: UserModel, sessionId: string) {
    // First check if the user is logged in
    if (!userModel.currentUser) {
        alert("You must be logged in to join a session.");
        return;
    }

    const docRef = doc(db, "sessions", sessionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // Add current user to the session
        const newUserInfo: UserInfoType = {
            userId: userModel.currentUser.uid,
            username: userModel.username,
        };

        await updateDoc(docRef, {
            participants: arrayUnion(newUserInfo),
        });

        userModel.setCurrentSessionId(sessionId);
        console.log("Joined session with ID:", sessionId);
        return true;
    } else {
        alert("Session ID not found.");
    }
}

export async function persistSessionSwipe(
    sessionId: string, 
    userId: string, 
    movie: { movieId: number; title: string; posterPath: string }
): Promise<boolean> {
    const sessionRef = doc(db, "sessions", sessionId);
    const movieLikesRef = doc(db, "sessions", sessionId, "likes", movie.movieId.toString());

    try {
        await runTransaction(db, async (transaction) => {
            const sessionDoc = await transaction.get(sessionRef);
            if (!sessionDoc.exists()) throw "Session does not exist!";
            
            const participants = sessionDoc.data().participants || [];
            const totalParticipants = participants.length;

            const movieDoc = await transaction.get(movieLikesRef);
            let likedBy: string[] = [];
            if (movieDoc.exists()) {
                likedBy = movieDoc.data().likedBy || [];
            }

            if (!likedBy.includes(userId)) {
                likedBy.push(userId);
            }

            if (likedBy.length >= totalParticipants && totalParticipants > 0) {
                transaction.update(sessionRef, {
                    match: {
                        movieId: movie.movieId,
                        title: movie.title,
                        poster_path: movie.posterPath || ""
                    },
                    status: "matched"
                });
            }

            transaction.set(movieLikesRef, { likedBy }, { merge: true });
        });

        console.log("Session swipe recorded successfully");
        return true;
    } catch (e) {
        console.error("Transaction failed: ", e);
        return false;
    }
}

async function addLikeToUser(userModel: UserModel, movie: {id: number, title: string, posterPath: string}) {
    const userId = userModel.currentUser?.uid;

    if (!userId) {
        console.error("No user logged in.");
        return;
    }

    // Before we add the like to the users liked movies we check if its already there
    const userLikesIds = userModel.likes.map(m => m.movieId);
    // If the user has already liked this movie, we dont add it again
    if (userLikesIds.includes(movie.id)) return;

    // Add like to users list of likes movies aswell
    const userLikesRef = doc(db, "users", userId);
    try {
        await updateDoc(userLikesRef, {
            likes: arrayUnion({title: movie.title, movieId: movie.id, poster_path: movie.posterPath}),
        });
    } catch (e) {
        console.error("Failed to update user likes: ", e);
    }
}

export function listenToSession(sessionId: string, model: MovieModel, sessionModel: SessionModel, userModel: UserModel) {
    const docRef = doc(db, "sessions", sessionId);
    // @ts-ignore  /* For npm run build */
    const m = model;
    // onSnapshot triggers every time the data in firestore changes
    const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            
            // Check if a match has been found
            if (data.match) {
                console.log("We have a match!", data.match);
                if (data.match) {
                    // Use queueMatch to handle it safely
                    sessionModel.queueMatch(data.match.movieId);

                    const usersInSession = data.participants?.map((p: UserInfoType) => p.username) || [];

                    const matchData: MatchType = {
                        movieId: data.match.movieId,
                        title: data.match.title,
                        poster_path: (TMDB_BASE_URL + "/w300" + data.match.poster_path) || null,
                        usersInSession: usersInSession,
                    }

                    userModel.addMatch(matchData);
                }
                // TODO!!! Update the model with match data and call some function to show the match screen
                
                //alert(`It's a match! Everyone wants to watch: ${data.match.title}`);
            }
        }
    });

    // We need to return the unsubscribe function so we can stop listening when not needed
    return unsubscribe;
}

export async function sendFriendRequest(fromUser: UserModel, toUsername: string): Promise<boolean> {
    // Find the target user by their username
    const userRef = collection(db, "users");
    const q = query(userRef, where("username", "==", toUsername));
    const querySnapshot = await getDocs(q);

    // If there is no user with that username return false and tell the user
    if (querySnapshot.empty) {
        console.error("User not found!");
        return false;
    }

    const targetDoc = querySnapshot.docs[0];
    const targetUserId = targetDoc.id;

    // You should not be able to send a friend request to yourself
    if (targetUserId === fromUser.userId) {
        console.error("Cannot send friend request to yourself");
        return false;
    }

    // Check if the target user is already a friend
    const isAlreadyFriend = fromUser.friends.some(friend => friend.userId === targetUserId);
    if (isAlreadyFriend) {
        console.error("User is already your friend");
        return false;
    }

    // Add request to target users friendRequests array
    const targetRef = doc(db, "users", targetUserId);
    await updateDoc(targetRef, {
        friendRequests: arrayUnion({
            fromUserId: fromUser.userId,
            fromUsername: fromUser.username,
            status: "pending"
        })
    });

    return true;
}

export async function acceptFriendRequest(userModel: UserModel, fromUserId: string, fromUsername: string): Promise<boolean> {
    // We need to be logged in to accept a friend request
    const userId = userModel.userId;
    if (!userId) return false;

    const batch = writeBatch(db);

    // Get the document references
    const currentUserRef = doc(db, "users", userId);
    const otherUserRef = doc(db, "users", fromUserId);

    /*
    batch.update(currentUserRef, {
        friends: arrayUnion({ userId: fromUserId, username: fromUsername }),
        friendRequests: arrayRemove({
            fromUserId: fromUserId,
            fromUsername: fromUsername,
            status: "pending"
        })
    });
    */

    userModel.acceptFriendRequest(fromUserId, fromUsername);

    // Update other user: add friend
    batch.update(otherUserRef, {
        friends: arrayUnion({ userId: userId, username: userModel.username })
    });

    await batch.commit();
    return true;
}

export async function sendLobbyInvite(
    fromUser: UserModel, 
    toUserId: string, 
    sessionId: string
): Promise<boolean> {
    // Ensure the client user is logged in
    if (!fromUser.userId) return false;

    // The invited users reference
    const targetUserRef = doc(db, "users", toUserId);
    
    // Add the lobby invite to the target user
    await updateDoc(targetUserRef, {
        invite: {
            fromUserId: fromUser.userId,
            fromUsername: fromUser.username,
            sessionId: sessionId,
            sentAt: new Date().toISOString()
        }
    });

    return true;
}

export async function acceptLobbyInvite(
    userModel: UserModel,
) {
    // Ensure the client user is logged in
    if (!userModel.currentUser) return false;

    const inviteLobbyId = userModel.invite?.sessionId
    // Remove the invite from user model
    userModel.invite = null;

    // Join the session
    if (!inviteLobbyId) return false;

    await joinSession(userModel, inviteLobbyId);
    
    return true;
}

export function declineLobbyInvite(userModel: UserModel){
    // Ensure the client user is logged in
    if (!userModel.currentUser) return false;

    userModel.invite = null;
    
    return true;
}
