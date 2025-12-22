/* [TODO] Not working */

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { firebaseConfig } from "./firebaseConfig";
import type { MovieModel } from "./MovieModel";
import { SessionModel } from "./SessionModel";
import { getFirestore, doc, setDoc, onSnapshot as firestoreOnSnapshot, collection } from "firebase/firestore";
import type { Unsubscribe } from "firebase/auth";
import type { UserModel } from "./UserModel";
import { persistSessionSwipe } from "./firestoreModel";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const firestore = getFirestore(app);

// @ts-ignore
window.db = db; // For console testing (like Dinnermodel)

// Mostly from DinnerModel:
export function connectToPersistence(model: MovieModel, reaction: any) {
  // Since we has multiple users, we save under the specific userId

  function modelInterestsACB() {
    return {
      curMovieId: model.curMovieId,
      userId: model.userId, // [TODO] userId for where to save
      /* [TODO] Add other things that must be persisted:
      likes: model.likes,
      dislikes: model.dislikes */
    };
  }

  function writeToCloudACB(data: any) {
    // Only save if we have a valid User ID
    if (data.userId) {
      const userRef = ref(db, `users/${data.userId}`); 
      // [TODO] Use userId with database

      // Set the data in Firebase
      // We use 'update' logic or just set specific fields to avoid overwriting everything
      set(userRef, {
        curMovieId: data.curMovieId,
        // [TODO] Other implementations? Last seen online notification?
      });
    }
  }

  // Read from cloud when app starts
  function readFromCloud() {
    // Simplified listener. Ideally, you listen AFTER auth.
    // placeholder for now
    if (model.userId) {
      const userRef = ref(db, `users/${model.userId}`);
      function onValueACB(snapshot: any) {
        // onValue used since it's a realtimeDatabase
        const data = snapshot.val();
        if (data) {
          // Update model with data from cloud
          // [TODO] onValue should be used to populate what others are liking
          // Only update if different to avoid loops
          if (data.curMovieId && data.curMovieId !== model.curMovieId) {
            model.setCurrentMovieId(data.curMovieId);
          }
        }
      }
      onValue(userRef, onValueACB);
    }
  }

  readFromCloud()

  // Triggers writeToCloudACB when modelInterestsACB changes
  reaction(modelInterestsACB, writeToCloudACB);
}

export function connectSessionToPersistence(session: SessionModel, userModel: UserModel, model: MovieModel, watchFunction: any) {
  let unsubscribeFirestore: Unsubscribe | null = null;
  
  // Flag to prevent write-back loops when receiving Firestore updates
  let isUpdatingFromFirestore = false;

  // We watch for changes in the sessionId of the moviemodel
  function sessionIdACB() {
    return userModel.currentSessionId;
  }

  function onSessionIdChangeACB(sessionId: string | null) {
    // Clean up previous listener if exists
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
      unsubscribeFirestore = null;
    }

    // Reset session state if no session
    if (!sessionId) {
      session.setReady(false);
      session.setSessionId(null);
      session.setParticipants([]);
      session.setHostId("");
      session.setLikes([]);
      session.setStatus("waiting");
      return;
    }

    const docRef = doc(firestore, "sessions", sessionId);
    const likeCollectionRef = collection(docRef, "likes");

    // Set up real-time listener for this session
    unsubscribeFirestore = firestoreOnSnapshot(docRef, (docSnap) => {
      if (!docSnap.exists()) {
        console.warn("Session document does not exist:", sessionId);
        return;
      }

      const data = docSnap.data();

      // Set flag to prevent triggering a write-back
      isUpdatingFromFirestore = true;

      // Update local session model with Firestore data
      session.setSessionId(data.sessionId || sessionId);
      session.setParticipants(data.participants || []);
      session.setHostId(data.hostId || "");
      session.setStatus(data.status || "waiting");
      session.setReady(true);

      // Reset flag after updates are applied (use setTimeout to let MobX reactions complete)
      setTimeout(() => {
        isUpdatingFromFirestore = false;
      }, 0);
    }, (error) => {
      console.error("Error listening to session:", error);
    });

    // This updates evertime the likes collection changes in the firestore database.
    const unsubscribeLikes = firestoreOnSnapshot(likeCollectionRef, (querySnapshot) => {
      // Callback runs every time the collection updates
      const movieLikeIds = querySnapshot.docs.map(doc => Number(doc.id));
      if (!movieLikeIds || !Array.isArray(movieLikeIds) || movieLikeIds.length === 0) {
        return;
      }
      model.insertMovieLikesIntoQueue(movieLikeIds);
      const idQueue = [...session.likes, ...movieLikeIds];
      session.setLikes([...new Set(idQueue)]); // removes duplicates
    }, (error) => {
      console.error("Error listening to likes collection:", error);
    });
    unsubscribeLikes
  }

  // Watch for status changes only - this is the main thing clients might update
  // Note: hostId should never be changed after session creation
  function statusACB() {
    return session.status;
  }

  // Only the HOST should be able to update the session status
  function persistStatusACB(newStatus: string) {
    const sessionId = userModel.currentSessionId;
    const userId = userModel.userId;
    
    // Don't persist if:
    // - Session not ready
    // - No session ID
    // - This update came from Firestore (prevents loop)
    // - Current user is not the host
    if (!session.ready || !sessionId || isUpdatingFromFirestore || userId !== session.hostId) {
      return;
    }

    const docRef = doc(firestore, "sessions", sessionId);

    // Only update status - don't touch participants, hostId, or other fields
    setDoc(docRef, { status: newStatus }, { merge: true }).catch(console.error);
  }

  // Watch for participants changes any user can remove themselves
  function participantsACB() {
    // Return a serialized version to trigger reaction on changes
    return JSON.stringify(session.participants);
  }

  function persistParticipantsACB() {
    const sessionId = userModel.currentSessionId;
    
    // We dont persist if:
    // Session not ready
    // No session ID
    // This update came from Firestore (prevents loop)
    if (!session.ready || !sessionId || isUpdatingFromFirestore) {
      return;
    }

    const docRef = doc(firestore, "sessions", sessionId);

    // Update participants in Firestore
    setDoc(docRef, { participants: session.participants }, { merge: true }).catch(console.error);
  }

  // Install the side effects
  // 1. Watch for session ID changes to set up/tear down Firestore listener
  watchFunction(sessionIdACB, onSessionIdChangeACB, { fireImmediately: true });
  
  // 2. Watch for status changes (host-only writes)
  watchFunction(statusACB, persistStatusACB);

  // 3. Watch for participants changes (any user can remove themselves)
  watchFunction(participantsACB, persistParticipantsACB);
}

export function connectUserToPersistence(user: UserModel, watchFunction: any) {
  if (!user.currentUser) return;

  const docRef = doc(firestore, "users", user.userId);
  
  // Flag to prevent write-back loops
  let isUpdatingFromFirestore = false;

  // Watch for pending session swipes
  function pendingSessionSwipeACB() {
    return user.pendingSessionSwipe;
  }

  async function persistSessionSwipeACB(swipe: { movieId: number; title: string; posterPath: string } | null) {
    // We need to have a valid swipe, session ID and user ID
    if (!swipe || !user.currentSessionId || !user.userId) return;

    // Persist the swipe to Firestore
    try {
      await persistSessionSwipe(user.currentSessionId, user.userId, swipe);
    } catch (e) {
      console.error("Failed to persist session swipe:", e);
    } finally {
      user.clearPendingSessionSwipe();
    }
  }

  // For checking changes
  function getUserInfoACB() {
    return {
      username: user.username,
      likes: [...user.likes],
      matches: [...user.matches],
      friends: [...user.friends],
      friendRequests: [...user.friendRequests],
      invite: user.invite,
    };
  }

  // Update the model in the cloud
  function persistUserModelACB() {
    if (!user.ready || isUpdatingFromFirestore) return;

    const modelData = {
      username: user.username,
      likes: user.likes,
      matches: user.matches,
      friends: user.friends,
      friendRequests: user.friendRequests,
      invite: user.invite,
    };

    setDoc(docRef, modelData, { merge: true })?.catch(console.error);
  }

  user.setReady(false);

  // Set up real-time listener for this user document
  const unsubscribeFirestore = firestoreOnSnapshot(docRef, (docSnap) => {
    if (!docSnap.exists()) {
      console.warn("User document does not exist:", user.userId);
      return;
    }

    const data = docSnap.data();

    // Set flag to prevent triggering a write-back
    isUpdatingFromFirestore = true;

    // Update local user model with Firestore data
    user.setUsername(data.username ?? "");
    user.setLikes(data.likes ?? []);
    user.setMatches(data.matches ?? []);
    user.setFriends(data.friends ?? []);
    user.setFriendRequests(data.friendRequests ?? []);
    user.setInvite(data.invite ?? null);
    user.setReady(true);

    // Reset flag after updates are applied
    setTimeout(() => {
      isUpdatingFromFirestore = false;
    }, 0);
  }, (error) => {
    console.error("Error listening to user document:", error);
  });

  // Install the side effect for local changes - this returns a disposer function
  const unsubscribeReaction = watchFunction(getUserInfoACB, persistUserModelACB);
  const unsubscribeSwipeReaction = watchFunction(pendingSessionSwipeACB, persistSessionSwipeACB);

  // Return a combined cleanup function
  return () => {
    unsubscribeFirestore();
    if (unsubscribeReaction) unsubscribeReaction();
    if (unsubscribeSwipeReaction) unsubscribeSwipeReaction();
  };
}