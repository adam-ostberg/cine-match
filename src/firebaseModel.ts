/* [TODO] Not working */

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { firebaseConfig } from "./firebaseConfig";
import type { ModelType } from "./MovieModel";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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
