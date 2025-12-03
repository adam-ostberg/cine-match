import { getMovieDetails, type MovieDetails, getMovieVideos} from "./apiConfig"
import { resolvePromise, type PromiseState } from "./resolvePromise";

export type ModelType = {
  userId: number;
  genres: [];
  likes: [];
  dislikes: [];
  curMovieId: number;
  movieDetailsPrmsState: PromiseState
  movieVideosPrmsState: PromiseState
  setId: (id: number) => void;
  setCurrentMovieId: (id: number) => void;
  currentMovieEffect: () => void;
  getMovieVideos: () => Promise<void | object>;
  getMovieTrailer: () => void;
}

export type Video = {
    "iso_639_1": string,
    "iso_3166_1": string,
    "name": string,
    "key": string,
    "site": string,
    "size": number,
    "type": string,
    "official": boolean,
    "published_at": string,
    "id": string
}

export const model: ModelType = {
    userId: 0,
    genres: [],
    likes: [],
    dislikes: [],
    curMovieId: 0,
    movieDetailsPrmsState: {promise: null, data: null, error: null}, 
    movieVideosPrmsState: {promise: null, data: null, error: null}, 

    setId(id: number) {
        this.userId = id;
    },

    setCurrentMovieId(id: number) {
        this.curMovieId = id;
    },

    currentMovieEffect() {
        const movieDetailsPrms = getMovieDetails(this.curMovieId);
        resolvePromise(movieDetailsPrms, this.movieDetailsPrmsState)
        return movieDetailsPrms
    },

    getMovieVideos() {
        const movieVideosPrms = getMovieVideos(this.curMovieId);
        resolvePromise(movieVideosPrms, this.movieVideosPrmsState)
        return movieVideosPrms
    },

    getMovieTrailer() {
        function getTrailerACB(data: any): string | null {
            if (!data || !data.results) return null;

            // Filter: Must be Official, a Trailer, and hosted on YouTube
            function getRelevantCandidatesCB(video: Video) {
                return video.official === true && 
                video.type === "Trailer" && 
                video.site === "YouTube"
            }

            const candidates = data.results.filter(getRelevantCandidatesCB);

            // Sorts for the best quality video
            function getHighestQualityCB(a: Video, b: Video) {
                return b.size - a.size
            }
            candidates.sort(getHighestQualityCB);

            // Return the key of the top result
            if (candidates.length > 0) {
                return candidates[0].key;
            }
            return null;
        }

        // Return the promise chain
        return this.getMovieVideos().then(getTrailerACB);
    }
}
