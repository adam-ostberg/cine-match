import { observable, configure, reaction } from "mobx";
configure({ enforceActions: "never" }); // we don't use Mobx actions in the Lab
import { model, type ModelType } from "./MovieModel";
import { connectSessionToPersistence, connectToPersistence, connectUserToPersistence } from "./firebaseModel";
import { observeAuth } from "./authService";
import { SessionModel, type SessionType } from "./SessionModel";
import { UserModel, type UserModelType } from "./UserModel";
import type { Unsubscribe } from "firebase/auth";

declare global {
  interface Window {
    model: ModelType; // or give it a specific type
    sessionModel: SessionType;
    userModel: UserModelType;
  }
}

export const reactiveModel = observable(model);

reactiveModel.fetchPopularMovies();
reactiveModel.fetchGenres().then(() => reactiveModel.toggleAllGenres());

function startDefaultDebugConfig() {
  reactiveModel.toggleSeededIconToMovie(550);
  const idQueuePrms = reactiveModel.setMovieIdQueue();
  idQueuePrms.then(() => reactiveModel.currentMovieEffect());
}
//startDefaultDebugConfig();

export const reactiveSessionModel = observable(SessionModel);
export const reactiveUserModel = observable(UserModel);

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
