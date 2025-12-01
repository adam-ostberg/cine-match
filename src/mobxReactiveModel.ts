import { observable, configure, reaction } from "mobx";
configure({ enforceActions: "never", });  // we don't use Mobx actions in the Lab
import { model, type ModelType } from "./MovieModel"


declare global {
  interface Window {
    model: ModelType; // or give it a specific type
  }
}

export const reactiveModel = observable(model);
window.model = reactiveModel

