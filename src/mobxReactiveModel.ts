import { observable, configure, reaction } from "mobx";
configure({ enforceActions: "never" }); // we don't use Mobx actions in the Lab
import { model, type ModelType } from "./MovieModel";
import { connectSessionToPersistence, connectToPersistence } from "./firebaseModel";
import { observeAuth } from "./authService";
import { SessionModel, type SessionType } from "./SessionModel";

declare global {
  interface Window {
    model: ModelType; // or give it a specific type
    sessionModel: SessionType;
  }
}

export const reactiveModel = observable(model);
reactiveModel.fetchPopularMovies();
reactiveModel.fetchGenres().then(() => reactiveModel.toggleAllGenres());
reactiveModel.toggleSeededIconToMovie(550);
export const reactiveSessionModel = observable(SessionModel);

const idQueuePrms = reactiveModel.setMovieIdQueue();
idQueuePrms.then(() => reactiveModel.currentMovieEffect());

function currentMovieIdACB() {
  return reactiveModel.curMovieId;
}

function movieIdEffectACB() {
  return reactiveModel.currentMovieEffect();
}

observeAuth((user) => {
  reactiveModel.setId(user ? user.uid : null);
});

reaction(currentMovieIdACB, movieIdEffectACB);

window.model = reactiveModel;
window.sessionModel = reactiveSessionModel;

// Connect models to persistence
connectToPersistence(reactiveModel, reaction);
connectSessionToPersistence(reactiveSessionModel, reactiveModel, reaction);
