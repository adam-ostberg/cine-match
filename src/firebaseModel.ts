/* [TODO] Not working */

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { firebaseConfig } from "./firebaseConfig";
import type { ModelType } from "./MovieModel";
import type { SessionType } from "./SessionModel";
import { getFirestore, doc, setDoc, onSnapshot as firestoreOnSnapshot } from "firebase/firestore";
import type { Unsubscribe } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const firestore = getFirestore(app);

// @ts-ignore
window.db = db; // For console testing (like Dinnermodel)

// Mostly from DinnerModel:
export function connectToPersistence(model: ModelType, reaction: any) {
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

export function connectSessionToPersistence(session: SessionType, model: ModelType, watchFunction: any) {
  let unsubscribeFirestore: Unsubscribe | null = null;
  
  // Flag to prevent write-back loops when receiving Firestore updates
  let isUpdatingFromFirestore = false;

  // We watch for changes in the sessionId of the moviemodel
  function sessionIdACB() {
    return model.getCurrentSessionId();
  }

  function onSessionIdChangeACB(sessionId: string | null) {
    // Clean up previous listener if exists
    if (unsubscribeFirestore) {
      unsubscribeFirestore();
      unsubscribeFirestore = null;
    }

    // Reset session state if no session
    if (!sessionId) {
      session.ready = false;
      session.sessionId = null;
      session.participants = [];
      session.hostId = "";
      session.likes = [];
      session.status = "waiting";
      return;
    }

    const docRef = doc(firestore, "sessions", sessionId);

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
      session.sessionId = data.sessionId || sessionId;
      session.participants = data.participants || [];
      session.hostId = data.hostId || "";
      session.likes = data.likes || [];
      session.status = data.status || "waiting";
      session.ready = true;

      // Reset flag after updates are applied (use setTimeout to let MobX reactions complete)
      setTimeout(() => {
        isUpdatingFromFirestore = false;
      }, 0);
    }, (error) => {
      console.error("Error listening to session:", error);
    });
  }

  // Watch for status changes only - this is the main thing clients might update
  // Note: participants are managed via arrayUnion in joinSession, not here
  // Note: hostId should never be changed after session creation
  function statusACB() {
    return session.status;
  }

  // Only the HOST should be able to update the session status
  function persistStatusACB(newStatus: string) {
    const sessionId = model.getCurrentSessionId();
    const userId = model.userId;
    
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

  // Install the side effects
  // 1. Watch for session ID changes to set up/tear down Firestore listener
  watchFunction(sessionIdACB, onSessionIdChangeACB, { fireImmediately: true });
  
  // 2. Watch for status changes (host-only writes)
  watchFunction(statusACB, persistStatusACB);
}

