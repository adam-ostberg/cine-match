import { getMovieDetails, type MovieDetails, type TMDBPopularMovieResult, getMovieVideos, fetchPopularMoviesPages} from "./apiConfig"
import { resolvePromise, type PromiseState } from "./resolvePromise";

export type ModelType = {
  userId: number;
  genres: [];
  likes: [];
  dislikes: [];
  curMovieId: number;
  movieDetailsPrmsState: PromiseState;
  nextMovieDetailPrmsState: PromiseState;
  movieVideosPrmsState: PromiseState;
  movieIdQueuePrmsState: PromiseState;
  popularMoviesPrmsState: PromiseState; 
  initiateStart: () => void;
  setId: (id: number) => void;
  setCurrentMovieId: (id: number) => void;
  currentMovieEffect: () => void;
  getMovieVideos: () => Promise<void | object>;
  getMovieTrailer: () => void;
  /* getPopularMovies: () => Promise<TMDBPopularMovieResult[]>; */
  setMovieIdQueue: () => Promise<any>;
  filterAndGetIdsFromMoviesACB: (movies: TMDBPopularMovieResult[]) => void;
  nextMovie: () => void;

  // NEW:
  movieDetailsById: { [id: number]: PromiseState };
  PREFETCH_SIZE: number;

  prefetchMovieDetails: (id: number) => void;
  ensurePrefetchWindow: () => void;
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
    curMovieId: 550,
    movieDetailsPrmsState: {promise: null, data: null, error: null}, 
    nextMovieDetailPrmsState: {promise: null, data: null, error: null}, 
    movieVideosPrmsState: {promise: null, data: null, error: null}, 
    movieIdQueuePrmsState: {promise: null, data: null, error: null},
    popularMoviesPrmsState: {promise: null, data: null, error: null},

    // NEW:
    movieDetailsById: {},
    PREFETCH_SIZE: 5,

    setId(id: number) {
        this.userId = id;
    },

    // Placeholder
    initiateStart() {
        console.log("Session started");
    },

    setCurrentMovieId(id: number) {
        this.curMovieId = id;
    },

    currentMovieEffect() {
        const movieIdsQueue = this.movieIdQueuePrmsState.data as number[] | null;
        if (!movieIdsQueue) {
            console.log("MovieIdsQueue is empty! call from currentMovieEffect()");
            return;
        }

        // 1) Ensure current movie is prefetched
        this.prefetchMovieDetails(this.curMovieId);

        // 2) Point the "active" PromiseState to the one for curMovieId
        const currentState = this.movieDetailsById[this.curMovieId];
        if (currentState) {
            this.movieDetailsPrmsState = currentState;
        }

        // 3) Make sure we have a buffer of upcoming movies prefetched
        this.ensurePrefetchWindow();

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
    },

    filterAndGetIdsFromMoviesACB(movies: TMDBPopularMovieResult[]) {
        const ids: number[] = movies.map(m => m.id);
        return ids;
    },

    setMovieIdQueue() {
        const prms = fetchPopularMoviesPages(1, 1);
        
        // Gets list for Home View
        resolvePromise(prms, this.popularMoviesPrmsState);

        // Gets IDs for the queue
        const idPrms = prms.then(this.filterAndGetIdsFromMoviesACB);
        resolvePromise(idPrms, this.movieIdQueuePrmsState);

        return idPrms;
    },

    /* setMovieIdQueue() {
        const popularMoviesPromise = fetchPopularMoviesPages(1, 1).then(this.filterAndGetIdsFromMoviesACB)
        resolvePromise(popularMoviesPromise, this.movieIdQueuePrmsState);
        return popularMoviesPromise;
    }, */

    nextMovie() {
        const movieIdsQueue = this.movieIdQueuePrmsState.data;
        if (!movieIdsQueue) { return };

        this.curMovieId = movieIdsQueue.shift(); 
    },

    prefetchMovieDetails(id: number) {

        // Already have a state for this id? Then skip.
        const existing = this.movieDetailsById[id];
        if (existing && (existing.promise || existing.data || existing.error)) {
            return;
        }

        if (!this.movieDetailsById[id]) {
            this.movieDetailsById[id] = { promise: null, data: null, error: null };
        }

        const state = this.movieDetailsById[id];

        const prms = getMovieDetails(id);
        resolvePromise(prms, state);  // This now updates a MobX-observable object
    },

    ensurePrefetchWindow() {
        const movieIdsQueue = this.movieIdQueuePrmsState.data as number[] | null;
        if (!movieIdsQueue || movieIdsQueue.length === 0) return;

        const n = Math.min(this.PREFETCH_SIZE, movieIdsQueue.length);

        for (let i = 0; i < n; i++) {
            const id = movieIdsQueue[i];
            this.prefetchMovieDetails(id);
        }
    },
}
