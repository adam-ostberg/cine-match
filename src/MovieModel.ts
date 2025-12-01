import { getMovieDetails, type MovieDetails } from "./apiConfig"
import { resolvePromise, type PromiseState } from "./resolvePromise";

export type ModelType = {
  userId: number;
  genres: [];
  likes: [];
  dislikes: [];
  curMovieId: number;
  movieDetailsPrmsState: PromiseState
  setId: (id: number) => void;
  setCurrentMovieId: (id: number) => void;
  currentMovieEffect: () => void;

}


export const model: ModelType = {
    userId: 0,
    genres: [],
    likes: [],
    dislikes: [],
    curMovieId: 0,
    movieDetailsPrmsState: {promise: null, data: null, error: null}, 


    setId(id: number) {
        this.userId = id;
    },

    setCurrentMovieId(id: number) {
        this.curMovieId = id;
    },

    currentMovieEffect() {
        const movieDetailsPrms = getMovieDetails(this.curMovieId);
        resolvePromise(movieDetailsPrms, this.movieDetailsPrmsState)
    }
}