import { getMovieDetails, type MovieDetails, type TMDBPopularMovieResult, getMovieVideos, fetchPopularMoviesPages, type TMDBVideoResults, type TMDBVideoType, getMovieCredits, getImdbId, getMovieList} from "./apiConfig"
import { resolvePromise, type PromiseState } from "./resolvePromise";
import { getImdbRating } from "./imdbApiConfig";

export type ModelType = {
  userId: number;
  genres: [];
  genresPrmsState: PromiseState;
  likes: [];
  dislikes: [];
  curMovieId: number;
  movieDetailsPrmsState: PromiseState;
  nextMovieDetailPrmsState: PromiseState;
  movieVideosPrmsState: PromiseState;
  movieIdQueuePrmsState: PromiseState;
  popularMoviesPrmsState: PromiseState;
  movieCreditsPrmsState: PromiseState; 
  imdbRatingPrmsState: PromiseState;
  initiateStart: () => void;
  setId: (id: number) => void;
  setCurrentMovieId: (id: number) => void;
  currentMovieEffect: () => void;
  getCurMovieCredits: () => void;
  getCurMovieTrailer: () => Promise<TMDBVideoType | undefined>;
  getMovieImdbRating: (id: number) => void;
  getMovieVideos: () => Promise<void | object>;
  getMovieTrailerKey: () => string | null;
  /* getPopularMovies: () => Promise<TMDBPopularMovieResult[]>; */
  setMovieIdQueue: () => Promise<any>;
  filterAndGetIdsFromMoviesACB: (data: any) => number[];
  nextMovie: () => void;

  // NEW:
  movieDetailsById: { [id: number]: PromiseState };
  PREFETCH_SIZE: number;

  prefetchMovieDetails: (id: number) => void;
  ensurePrefetchWindow: () => void;
  fetchGenres: () => void;
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
    genresPrmsState: {promise: null, data: null, error: null},
    likes: [],
    dislikes: [],
    curMovieId: 550,
    movieDetailsPrmsState: {promise: null, data: null, error: null}, 
    nextMovieDetailPrmsState: {promise: null, data: null, error: null}, 
    movieVideosPrmsState: {promise: null, data: null, error: null}, 
    movieIdQueuePrmsState: {promise: null, data: null, error: null},
    popularMoviesPrmsState: {promise: null, data: null, error: null},
    movieCreditsPrmsState: {promise: null, data: null, error: null},
    imdbRatingPrmsState: {promise: null, data: null, error: null},

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

        this.getCurMovieTrailer();
        this.getCurMovieCredits();
        this.getMovieImdbRating(this.curMovieId);
        // 1) Ensure current movie is prefetched
        this.prefetchMovieDetails(this.curMovieId);

        // 2) Point the "active" PromiseState to the one for curMovieId
        const currentState = this.movieDetailsById[this.curMovieId];
        if (currentState) {
            this.movieDetailsPrmsState = currentState;
        }

        // this.getMovieVideos();

        // 3) Make sure we have a buffer of upcoming movies prefetched
        this.ensurePrefetchWindow();
    },

    getCurMovieCredits() {
        const movieCreditsPrms = getMovieCredits(this.curMovieId);
        resolvePromise(movieCreditsPrms, this.movieCreditsPrmsState);
    },

    getCurMovieTrailer() {
        function filterByTrailerACB(data: TMDBVideoResults): TMDBVideoType | undefined {
            const trailer = data.results.find(video => video.type == "Trailer");
            return trailer
        }

        const movieVideosPrms = getMovieVideos(this.curMovieId).then(filterByTrailerACB)
        resolvePromise(movieVideosPrms, this.movieVideosPrmsState)
        return movieVideosPrms  
    },


    getMovieVideos() {
        const movieVideosPrms = getMovieVideos(this.curMovieId);
        resolvePromise(movieVideosPrms, this.movieVideosPrmsState);
        return movieVideosPrms;
    },

    
    getMovieTrailerKey() {
        const data = this.movieVideosPrmsState.data;
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
    },

    getMovieImdbRating(id: number) {
        const imdbRatingPrms = getImdbId(id).then(getImdbRating);
        resolvePromise(imdbRatingPrms, this.imdbRatingPrmsState);
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

    fetchGenres() {
        const genresPrms = getMovieList().then((data: any) => {
            if (data && data.genres) {
                this.genres = data.genres;
            }
            return data;
        });
        resolvePromise(genresPrms, this.genresPrmsState);
    }
}
