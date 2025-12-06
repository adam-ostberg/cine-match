import { getMovieDetails,/*  type MovieDetails, */ type TMDBPopularMovieResult, getMovieVideos, fetchPopularMoviesPages, type TMDBVideoResults, type TMDBVideoType, getMovieCredits, getImdbId, type WatchProvidersResponse, getWatchProviders, getMovieList, type TMDBGenre} from "./apiConfig"
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
  watchProvidersPrmsState: PromiseState;
  currentSessionId: string | null;
  selectedGenreIds: number[];
  minRating: number;
  minRuntime: number;
  maxRuntime: number;
  setRuntime: (min: number, max: number) => void;
  initiateStart: () => void;
  setId: (id: number) => void;
  setCurrentMovieId: (id: number) => void;
  currentMovieEffect: () => void;
  getCurMovieCredits: () => void;
  getCurMovieTrailer: () => Promise<TMDBVideoType | undefined>;
  getCurWatchProviders: () => Promise<WatchProvidersResponse | any>;
  getMovieImdbRating: (id: number) => void;
  /* getPopularMovies: () => Promise<TMDBPopularMovieResult[]>; */
  setMovieIdQueue: () => Promise<any>;
  filterAndGetIdsFromMoviesACB: (data: any) => number[];
  nextMovie: () => void;
  toggleGenre: (id: number) => void;
  toggleAllGenres: () => void;
  setMinRating: (rating: number) => void;

  // NEW:
  movieDetailsById: { [id: number]: PromiseState };
  PREFETCH_SIZE: number;

  prefetchMovieDetails: (id: number) => void;
  ensurePrefetchWindow: () => void;
  fetchGenres: () => void;

  // Session management
  setSessionId: (sessionId: string | null) => void;
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
    currentSessionId: null, /* Added for it to work for me, might class with other implementation */
    selectedGenreIds: [],
    minRating: 0,
    minRuntime: 0,
    maxRuntime: 400,
    curMovieId: 550,
    movieDetailsPrmsState: {promise: null, data: null, error: null}, 
    nextMovieDetailPrmsState: {promise: null, data: null, error: null}, 
    movieVideosPrmsState: {promise: null, data: null, error: null}, 
    movieIdQueuePrmsState: {promise: null, data: null, error: null},
    popularMoviesPrmsState: {promise: null, data: null, error: null},
    movieCreditsPrmsState: {promise: null, data: null, error: null},
    imdbRatingPrmsState: {promise: null, data: null, error: null},
    watchProvidersPrmsState: {promise: null, data: null, error: null},

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
        this.getCurWatchProviders();
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
            if (!trailer) {
                if (data.results.length) {
                    const video = data.results[0];
                    return video;
                }
                else { console.log("Couldn't find any video for the Movie, inside getCurMovieTrailer function.") };
            }
            return trailer
        }

        const movieVideosPrms = getMovieVideos(this.curMovieId).then(filterByTrailerACB)
        resolvePromise(movieVideosPrms, this.movieVideosPrmsState)
        return movieVideosPrms  
    },

    getCurWatchProviders() {
        const watchProvidersPrms = getWatchProviders(this.curMovieId);
        resolvePromise(watchProvidersPrms, this.watchProvidersPrmsState);
        return watchProvidersPrms;
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

    /* For OptionsView */
    toggleGenre(id: number) {
        function keepOtherGenresCB(existingId: number) {
            return existingId !== id;
        }
        if (this.selectedGenreIds.includes(id)) {
            // If it was already selected, we want to remove it.
            this.selectedGenreIds = this.selectedGenreIds.filter(keepOtherGenresCB);
        } else {
            // If it wasn't selected, we want to add it.
            this.selectedGenreIds = [...this.selectedGenreIds, id];
        }
    },

    toggleAllGenres() {
        // If all are currently selected, clear them. Otherwise, select all.
        function selectAllCB(genre: TMDBGenre) {
            return genre.id;
        }

        if (this.selectedGenreIds.length === this.genres.length) {
            this.selectedGenreIds = [];
        } else {
            this.selectedGenreIds = this.genres.map(selectAllCB);
        }
    },

    setMinRating(rating: number) {
        this.minRating = rating;
    },

    setRuntime(min: number, max: number) {
        this.minRuntime = min;
        this.maxRuntime = max;
    },

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
    },

    setSessionId(sessionId: string | null) {
        this.currentSessionId = sessionId;
    }
}
