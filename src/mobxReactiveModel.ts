import { configure, reaction } from "mobx";
configure({ enforceActions: "always" });
import { MovieModel} from "./MovieModel";
import { connectSessionToPersistence, connectToPersistence, connectUserToPersistence } from "./firebaseModel";
import { observeAuth } from "./authService";
import { SessionModel } from "./SessionModel";
import { UserModel } from "./UserModel";
import type { Unsubscribe } from "firebase/auth";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "./firebaseConfig";

declare global {
  interface Window {
    model: MovieModel; // or give it a specific type
    sessionModel: SessionModel;
    userModel: UserModel;
  }
}

export const reactiveModel = new MovieModel();

reactiveModel.fetchPopularMovies();
reactiveModel.fetchGenres().then(() => reactiveModel.toggleAllGenres());

function startDefaultDebugConfig() {
  reactiveModel.toggleSeededIconToMovie(550);
  const idQueuePrms = reactiveModel.setMovieIdQueue();
  idQueuePrms.then(() => reactiveModel.currentMovieEffect());
}
//startDefaultDebugConfig();

export const reactiveSessionModel = new SessionModel();
export const reactiveUserModel = new UserModel();


function currentMovieIdACB() {
  return reactiveModel.curMovieId;
}

function movieIdEffectACB() {
  return reactiveModel.currentMovieEffect();
}

// TODO: Maybe obselete???
observeAuth((user) => {
  reactiveModel.setId(user ? user.uid : null);
});

// Track the unsubscribe function for user persistence
let userPersistenceUnsubscribe: (() => void) | undefined;

// Automatically update the current user in the user model based on auth
observeAuth((user) => {
    // Clean up previous listener if exists
    if (userPersistenceUnsubscribe) {
      userPersistenceUnsubscribe();
      userPersistenceUnsubscribe = undefined;
    }

    // Reset user model state on sign out
    if (!user) {
      reactiveUserModel.setCurrentUser(null);
      reactiveUserModel.setUserId("");
      reactiveUserModel.setUsername("");
      reactiveUserModel.setLikes([]);
      reactiveUserModel.matches = [];
      reactiveUserModel.ready = false;
      return;
    }

    reactiveUserModel.setCurrentUser(user);
    reactiveUserModel.setUserId(user.uid);
    userPersistenceUnsubscribe = connectUserToPersistence(reactiveUserModel, reaction);
});

reaction(currentMovieIdACB, movieIdEffectACB);

function sessionModelLikedACB() {
  return reactiveSessionModel.likes;
}
function sessionLikesChangedEffectACB() {
  return reactiveModel.insertMovieLikesIntoQueue(reactiveSessionModel.likes);
}

//reaction(sessionModelLikedACB, sessionLikesChangedEffectACB);

window.model = reactiveModel;
window.sessionModel = reactiveSessionModel;
window.userModel = reactiveUserModel;

// Connect models to persistence
connectToPersistence(reactiveModel, reaction);
connectSessionToPersistence(reactiveSessionModel, reactiveUserModel, reactiveModel, reaction);

// Handle page close/refresh and remove the user from session
window.addEventListener("beforeunload", () => {
  const sessionId = reactiveUserModel.currentSessionId;
  const userId = reactiveUserModel.userId;
  const username = reactiveUserModel.username;
  
  if (sessionId && userId) {
    // Update the local model first
    reactiveSessionModel.removeUser(userId);
    
    // Try to persist to Firestore using a synchronous approach
    // This may not always complete, but it's the best we can do client-side
    const docRef = doc(db, "sessions", sessionId);
    updateDoc(docRef, {
      participants: arrayRemove({ userId, username })
    }).catch(console.error);
  }
});
