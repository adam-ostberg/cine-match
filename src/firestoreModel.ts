import { db } from "./firebaseConfig.ts";
import { type ModelType } from "./MovieModel.ts";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, runTransaction, onSnapshot } from "firebase/firestore";

// Create a new session in Firebase and return the session ID
export async function createSession(model: ModelType) {
    // First check if the user is logged in
    if (!model.userId) {
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
            match: null,
            created: new Date(),
            participants: [model.userId],
        });
        console.log("Session created successfully with ID:", sessionId);
    } catch (error) {
        console.error("Error creating session:", error);
        throw error;
    }

    // Set and return the session ID
    model.setSessionId(sessionId);
    console.log("Session created with ID: ", sessionId);
    return sessionId;
}

export async function joinSession(model: ModelType, sessionId: string) {
    // First check if the user is logged in
    if (!model.userId) {
        alert("You must be logged in to join a session.");
        return;
    }

    const docRef = doc(db, "sessions", sessionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // Add current user to the session
        await updateDoc(docRef, {
            participants: arrayUnion(model.userId),
        });

        model.setSessionId(sessionId);
        console.log("Joined session with ID:", sessionId);
        return true;
    } else {
        alert("Session ID not found.");
    }
}

export async function handleSwipeInSession(sessionId: string, userId: string, movie: {id: number, title: string, posterPath: string}, liked: boolean) {
    if (!liked) return; // Only likes are relevant for matching

    const sessionRef = doc(db, "sessions", sessionId);
    const movieLikesRef = doc(db, "sessions", sessionId, "likes", movie.id.toString());

    try {
        // runTransaction handles race conditions for us
        await runTransaction(db, async (transaction) => {
            // Get session data to see how many people are in the current session
            const sessionDoc = await transaction.get(sessionRef);
            if (!sessionDoc.exists()) throw "Session does not exist!";
            
            const participants = sessionDoc.data().participants || [];
            const totalParticipants = participants.length;

            // Get current likes for this movie
            const movieDoc = await transaction.get(movieLikesRef);
            let likedBy = [];
            if (movieDoc.exists()) {
                likedBy = movieDoc.data().likedBy || [];
            }

            // Avoid double counting
            if (!likedBy.includes(userId)) {
                likedBy.push(userId);
            }

            // Check for Match
            if (likedBy.length >= totalParticipants && totalParticipants > 0) {
                // We have a match! Update the main session document
                transaction.update(sessionRef, {
                    match: {
                        movieId: movie.id,
                        title: movie.title,
                        poster_path: movie.posterPath || "" // Pass relevant data
                    },
                    status: "matched"
                });
            }

            // Save the like
            transaction.set(movieLikesRef, { likedBy }, { merge: true });
        });
        console.log("Swipe recorded successfully");
    } catch (e) {
        console.error("Transaction failed: ", e);
    }
}

export function listenToSession(sessionId: string, model: ModelType) {
    const docRef = doc(db, "sessions", sessionId);
    // @ts-ignore  /* For npm run build */
    const m = model
    // onSnapshot triggers every time the data in firestore changes
    const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            
            // Check if a match has been found
            if (data.match) {
                console.log("We have a match!", data.match);
                
                // TODO!!! Update the model with match data and call some function to show the match screen
                
                alert(`It's a match! Everyone wants to watch: ${data.match.title}`);
            }
        }
    });

    // We need to return the unsubscribe function so we can stop listening when not needed
    return unsubscribe;
}
