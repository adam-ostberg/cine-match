import { observable, configure, reaction } from "mobx";
configure({ enforceActions: "never" }); // we don't use Mobx actions in the Lab
import { model, type ModelType } from "./MovieModel";
import { connectToPersistence } from "./firebaseModel";

declare global {
  interface Window {
    model: ModelType; // or give it a specific type
  }
}

export const reactiveModel = observable(model);
const idQueuePrms = reactiveModel.setMovieIdQueue();
idQueuePrms.then(() => reactiveModel.currentMovieEffect());

export const modelActions = {
  nextMovie: reactiveModel.nextMovie.bind(reactiveModel),
  setMovieIdQueue: reactiveModel.setMovieIdQueue.bind(reactiveModel),
  currentMovieEffect: reactiveModel.currentMovieEffect.bind(reactiveModel),
};


function currentMovieIdACB() {
  return reactiveModel.curMovieId;
}

function movieIdEffectACB() {
  return reactiveModel.currentMovieEffect();
}

reaction(currentMovieIdACB, movieIdEffectACB);

window.model = reactiveModel;

connectToPersistence(reactiveModel, reaction);
