import { getMovieDetails,/*  type MovieDetails, */ type TMDBMoviePageResult, type TMDBMoviePage, getMovieVideos, getPopularMovies, fetchMoviesPages, type TMDBVideoResults, type TMDBVideoType, getMovieCredits, getImdbId, type WatchProvidersResponse, getWatchProviders, getMovieList, type TMDBGenre, type TMDBsearchData, searchTMDBMovies, getRecommendedMovie, type MovieDetails } from "./apiConfig"
import { resolvePromise, type PromiseState } from "./resolvePromise";
import { getImdbRating } from "./imdbApiConfig";
import { handleSwipeInSession } from "./firestoreModel";
import { fetchImdbRatings } from "./testImdbApi";
import { type LikesType } from "./SessionModel";

export type ModelType = {
    username: string;
    userId: string | null;
    genres: [];
    genresPrmsState: PromiseState;
    likes: number[];
    dislikes: number[];
    curMovieId: number;
    movieDetailsPrmsState: PromiseState;
    movieVideosPrmsState: PromiseState;
    movieIdQueuePrmsState: PromiseState;
    popularMoviesPrmsState: PromiseState;
    movieCreditsPrmsState: PromiseState; 
    imdbRatingPrmsState: PromiseState;
    watchProvidersPrmsState: PromiseState;
    searchMoviesPrmsState: PromiseState;
    getRecPrmsState: PromiseState;
    getCurrentSessionUsernamesPrmsState: PromiseState;
    currentSessionId: string | null;
    selectedGenreIds: number[];
    selectedSeededIds: number[];
    minRating: number;
    minRuntime: number;
    maxRuntime: number;
    prefetchWindowPrmsState: PromiseState;
    alltimeLikedMovieIds: number[]; 
    alltimeLikedMoviesArray: TMDBMoviePageResult[];
    profilePic: string | undefined;
    setRuntime: (min: number, max: number) => void;
    initiateStart: () => void;
    setId: (id: string | null) => void;
    setCurrentMovieId: (id: number | undefined | void | null) => void;
    getLatestPrefetchMovieId: () => number | void;
    currentMovieEffect: () => void;
    getCurMovieCredits: () => void;
    getCurMovieTrailer: () => Promise<TMDBVideoType | undefined>;
    getCurWatchProviders: () => Promise<WatchProvidersResponse | any>;
    getMovieImdbRating: (id: number) => void;
    /* getPopularMovies: () => Promise<TMDBMoviePageResult[]>; */
    fetchPopularMovies: () => Promise<TMDBMoviePageResult[]>;
    setMovieIdQueue: () => Promise<any>;
    insertRecommendedMovieIntoQueue: (movieId: number) => void;
    insertMovieLikesIntoQueue: (likes: number[]) => void;
    filterMoviesByOptionParams: (data: TMDBMoviePageResult[]) => Promise<number[] | undefined>;
    filterAndGetIdsFromMoviesACB: (data: any) => number[];
    nextMovie: () => void;
    toggleGenre: (id: number) => void;
    toggleAllGenres: () => void;
    setMinRating: (rating: number) => void;
    searchMovie: (q: string) => void;
    getRecommendations: (id: number) => Promise<TMDBMoviePageResult[]>;
    toggleSeededIconToMovie: (id: number) => void;
    toggleAlltimeLike: (movie: TMDBMoviePageResult, removePossible?: boolean) => void
    setUsername: (username: string) => void;
    

    // NEW:
    movieDetailsById: { [id: number]: PromiseState };
    PREFETCH_SIZE: number;

    prefetchMovieDetails: (id: number) => Promise<void | object> | void;
    ensurePrefetchWindow: () => void;
    fetchGenres: () => Promise<any>;

    // Session management
    setSessionId: (sessionId: string | null) => void;
    getCurrentSessionId: () => string | null;

    reportSwipe: (movieId: number, title: string, posterPath: string, liked: boolean) => void;
    addToLiked: (movieId: number) => void;
    addToDisliked: (movieId: number) => void;
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
    userId: null,
    genres: [],
    genresPrmsState: {promise: null, data: null, error: null},
    likes: [],
    dislikes: [],
    currentSessionId: null, /* Added for it to work for me, might class with other implementation */
    selectedGenreIds: [],
    selectedSeededIds: [],
    minRating: 0,
    minRuntime: 0,
    maxRuntime: 400,
    curMovieId: 550,
    movieDetailsPrmsState: {promise: null, data: null, error: null}, 
    movieVideosPrmsState: {promise: null, data: null, error: null}, 
    movieIdQueuePrmsState: {promise: null, data: null, error: null},
    popularMoviesPrmsState: {promise: null, data: null, error: null},
    movieCreditsPrmsState: {promise: null, data: null, error: null},
    imdbRatingPrmsState: {promise: null, data: null, error: null},
    watchProvidersPrmsState: {promise: null, data: null, error: null},
    prefetchWindowPrmsState: {promise: null, data: null, error: null},
    searchMoviesPrmsState: {promise: null, data: null, error: null},
    getRecPrmsState: {promise: null, data: null, error: null},
    getCurrentSessionUsernamesPrmsState: {promise: null, data: null, error: null},
    username: "", // temp placeholder
    alltimeLikedMovieIds: [],
    alltimeLikedMoviesArray: [],
    profilePic: undefined,

    // NEW:
    movieDetailsById: {},
    PREFETCH_SIZE: 5,

    setId(id: string | null) {
        this.userId = id;
    },

    // Placeholder
    initiateStart() {
        console.log("Session started");
    },

    setCurrentMovieId(id: number | undefined | void | null) {
        if (!id) return;
        this.curMovieId = id;
    },

    getLatestPrefetchMovieId() {
        if (!this.prefetchWindowPrmsState.data || !Array.isArray(this.prefetchWindowPrmsState.data)) return;
        if (this.prefetchWindowPrmsState.data.length === 0) return;

        const latestId = this.prefetchWindowPrmsState.data[0].id;
        return latestId;
    },

    currentMovieEffect() {
        const movieIdsQueue = this.movieIdQueuePrmsState.data as number[] | null;
        if (!movieIdsQueue) {
            console.log("MovieIdsQueue is empty! call from currentMovieEffect()");
            return;
        }

        this.prefetchMovieDetails(this.curMovieId);
        // 2) Point the "active" PromiseState to the one for curMovieId
        const currentState = this.movieDetailsById[this.curMovieId];
        if (currentState) {
            this.movieDetailsPrmsState = currentState;
        }

        this.ensurePrefetchWindow();

        this.getCurMovieTrailer();
        this.getCurMovieCredits();
        this.getMovieImdbRating(this.curMovieId);
        this.getCurWatchProviders();
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

    filterAndGetIdsFromMoviesACB(movies: TMDBMoviePageResult[]) {
        const ids: number[] =  [this.curMovieId, ...movies.map(m => m.id)];
        return ids;
    },

    setMovieIdQueue() {

        const recommendationPrmses = this.selectedSeededIds.map(id => this.getRecommendations(id))
        const popularMoviesPrms = fetchMoviesPages(getPopularMovies, 1, 1);
        const fetchPrmses = [...recommendationPrmses, popularMoviesPrms]

        function getDataACB(response: any) {
            return response as Array<TMDBMoviePageResult[]>; 
        }
        function getMovieResultsACB(data: Array<TMDBMoviePageResult[]>): TMDBMoviePageResult[] {
            const recommendedMovies = data.slice(0, data.length-1).flat().map(movie => ({...movie, sourceType: "recommended"})) // every element but the last
            const popularMovies = data[data.length-1].flat().map(movie => ({...movie, sourceType: "popular"})) // the last element

            const allMovies = [...recommendedMovies, ...popularMovies];

            const seen = new Set<number | string>();
            const allMoviesNonDuplicates = allMovies.filter(movie => { // removes duplicates
                if (seen.has(movie.id)) return false;
                seen.add(movie.id);
                return true;
            });

            return allMoviesNonDuplicates;
        }
        const prms = Promise.all(fetchPrmses)
            .then(getDataACB)
            .then(getMovieResultsACB)
            .then(this.filterMoviesByOptionParams.bind(this))
        
        resolvePromise(prms, this.movieIdQueuePrmsState);

        return prms;
    },

    async insertRecommendedMovieIntoQueue(movieId: number) {

        const movies = await this.getRecommendations(movieId);
        const establishedIdQueue = this.movieIdQueuePrmsState.data ?? [];

        const selMoviesIds = movies
            .map(movie => movie.id)
            .filter(
                id => !this.likes.includes(id) // not in liked
                && !this.dislikes.includes(id) // not in disliked
                && !establishedIdQueue.includes(id) // not in the queue already
            )
            .slice(0, 4);

        
        if (!!this.movieIdQueuePrmsState.data) {
            const idQueue = [...this.movieIdQueuePrmsState.data]
            idQueue.splice(6, 0, ...selMoviesIds) // insert 5 movies into position 6 of the queue
            this.movieIdQueuePrmsState.data = idQueue;
        }
        else {
            const idQueue = selMoviesIds;
            this.movieIdQueuePrmsState.data = idQueue;                
        }
    },

    insertMovieLikesIntoQueue(likes: number[]) {
        const establishedIdQueue = this.movieIdQueuePrmsState.data ?? [];

        const filteredMovieIds = likes
            .filter(id => !this.likes.includes(id) && !this.dislikes.includes(id) && !establishedIdQueue.includes(id));

        if (!filteredMovieIds) return;
        if (!!this.movieIdQueuePrmsState.data) {
            const idQueue = [...this.movieIdQueuePrmsState.data]
            idQueue.splice(4, 0, ...filteredMovieIds);
            this.movieIdQueuePrmsState.data = idQueue;
        }
    },

    fetchPopularMovies() {
        const prms = fetchMoviesPages(getPopularMovies, 1, 1);
        
        // Gets list for Home View
        resolvePromise(prms, this.popularMoviesPrmsState);

        return prms;
    },

    /* For OptionsView */
    searchMovie(q: string) {
        if (!q) return;
        const searchData: TMDBsearchData = {
                query: q,
                include_adult: false,
                // Add other options [?]
            }
        const prms = searchTMDBMovies(searchData);
        resolvePromise(prms, this.searchMoviesPrmsState);
    },

    getRecommendations(id: number): Promise<TMDBMoviePageResult[]> {
        // wrapper function that matches the signature: (page) => Promise
        // Cast Promise<TMDBMoviePage> because API return type includes 'void' (fix? [TODO])
        function fetcherFnCB(pageToFetch: number) {
            return getRecommendedMovie(id, pageToFetch) as Promise<TMDBMoviePage>; 
        };
        // Now pass the wrapper function
        const prms = fetchMoviesPages(fetcherFnCB, 1, 1); /* [TODO] Fetch max pages? */
        
        resolvePromise(prms, this.getRecPrmsState);
        return prms;
    },

    async filterMoviesByOptionParams(data: TMDBMoviePageResult[]): Promise<number[] | undefined>  {
        const filteredData = data.filter(movie =>
            movie.genre_ids.some(genre => this.selectedGenreIds.includes(genre)) // filter by selected gebres
            && !this.likes.includes(movie.id) // not in liked
            && !this.dislikes.includes(movie.id) // not in disliked
        );
        if (filteredData.length === 0) return;

        const details: MovieDetails[] = [];

        function sleep(ms: number): Promise<void> {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        for (const movie of filteredData) {
            const detail = await getMovieDetails(movie.id) as MovieDetails;
            if (!detail) {
                continue;
            }
            details.push(detail);
            await sleep(10); // Do this to avoid API Rate limiting
        }

        const imdbIds = details.map(detail => detail.imdb_id);

        const ratings = (await fetchImdbRatings(imdbIds)).data.titles;

        const movieIdToRating = new Map<number, number>();
        const movieIdToRuntime = new Map<number, number>();

        for (const detail of details) {
            movieIdToRuntime.set(detail.id, detail.runtime);
            const rating = ratings.find(movie => movie.id === detail.imdb_id);
            if (!rating || !rating.ratingsSummary.aggregateRating) continue;
            movieIdToRating.set(detail.id, rating.ratingsSummary.aggregateRating)
        }

        const result = filteredData
            .filter(movie => {
                const rating = movieIdToRating.get(movie.id);
                const runtime = movieIdToRuntime.get(movie.id);
                if (!rating  || rating <= this.minRating) { return false };
                if (!runtime || runtime <= this.minRuntime || runtime >= this.maxRuntime) { return false };
                return true
            })
            .map(movie => {
                return {...movie, imdbRating: movieIdToRating.get(movie.id), runtime: movieIdToRuntime.get(movie.id)}
            });

        return result.map(movie => movie.id);
    },

    toggleSeededIconToMovie(id: number) {
        function keepOtherSeededCB(existingId: number) {
            return existingId !== id;
        }
        if (this.selectedSeededIds.includes(id)) {
            // If it was already selected, we want to remove it.
            this.selectedSeededIds = this.selectedSeededIds.filter(keepOtherSeededCB);
        } else {
            // If it wasn't selected, we want to add it.
            this.selectedSeededIds = [...this.selectedSeededIds, id];
        }
    },

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
        movieIdsQueue.shift(); 
        this.curMovieId = movieIdsQueue[0];
    },

    prefetchMovieDetails(id: number) {

        // Already have a state for this id? Then skip.
        const existing = this.movieDetailsById[id];
        if (existing && (existing.promise || existing.data || existing.error)) {
            return existing.promise;
        }

        if (!this.movieDetailsById[id]) {
            this.movieDetailsById[id] = { promise: null, data: null, error: null };
        }

        const state = this.movieDetailsById[id];

        const prms = getMovieDetails(id);
        resolvePromise(prms, state);  // This now updates a MobX-observable object
        return prms
    },

    ensurePrefetchWindow() {
        const movieIdsQueue = this.movieIdQueuePrmsState.data as number[] | null;
        if (!movieIdsQueue || movieIdsQueue.length === 0) return;

        const n = Math.min(this.PREFETCH_SIZE, movieIdsQueue.length);

        const ids = movieIdsQueue.slice(0, n);
        const promises = ids.map((id) => this.prefetchMovieDetails(id));

        // This Promise resolves only when ALL of them are done
        const allPrms = Promise.all(promises);

        // allPrms resolves to an array of movie details (same order as ids)
        resolvePromise(allPrms, this.prefetchWindowPrmsState);
    },

    fetchGenres() {
        const genresPrms = getMovieList().then((data: any) => {
            if (data && data.genres) {
                this.genres = data.genres;
            }
            return data;
        });
        resolvePromise(genresPrms, this.genresPrmsState);
        return genresPrms
    },

    setSessionId(sessionId: string | null) {
        this.currentSessionId = sessionId;
    },

    getCurrentSessionId() {
        return this.currentSessionId;
    },

    async reportSwipe(movieId: number, title: string, posterPath: string, liked: boolean) {
        if (this.currentSessionId && this.userId) {
            await handleSwipeInSession(this.currentSessionId, this.userId, {id: movieId, title, posterPath}, liked);
        }
    },

    setUsername(username: string) {
        this.username = username;
    },

    toggleAlltimeLike(movie: TMDBMoviePageResult, removePossible: boolean = true) { /* [TODO] Make a reaction to add movie details to AlltimeLiked */
        const targetId = movie.id;

        function matchesTargetIdCB(existingMovie: TMDBMoviePageResult) {
            return existingMovie.id === targetId;
        }
        if (removePossible && this.alltimeLikedMoviesArray.some(matchesTargetIdCB)) { // if we should remove & its already liked
            // If it was already selected, we want to remove it.
            function keepOthersCB(existingMovie: TMDBMoviePageResult) {
                return existingMovie.id !== targetId;
            }
            this.alltimeLikedMoviesArray = this.alltimeLikedMoviesArray.filter(keepOthersCB);
        } else {
            // If it wasn't selected, we want to add it.
            this.alltimeLikedMoviesArray = [...this.alltimeLikedMoviesArray, movie];
        }
    },

    addToLiked(id: number) {
        this.likes.push(id);
    },
    addToDisliked(id: number) {
        this.dislikes.push(id);
    }
}
