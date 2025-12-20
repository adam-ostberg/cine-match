import { getMovieDetails,/*  type MovieDetails, */ type TMDBMoviePageResult, type TMDBMoviePage, getMovieVideos, getPopularMovies, fetchMoviesPages, type TMDBVideoResults, type TMDBVideoType, getMovieCredits, getImdbId, type WatchProvidersResponse, getWatchProviders, getMovieList, type TMDBGenre, type TMDBsearchData, searchTMDBMovies, getRecommendedMovie, type MovieDetails } from "./apiConfig"
import { resolvePromise, type PromiseState } from "./resolvePromise";
import { getImdbRating } from "./imdbApiConfig";
import { filterByRatingAndRuntime, getFilteredPopularMovies } from "./helperFunctions";
import { makeAutoObservable, runInAction } from "mobx";

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

export class MovieModel {
    userId: string | null = null;
    genres: any[] = [];
    genresPrmsState: PromiseState = {promise: null, data: null, error: null};
    likes: number[] = [];
    dislikes: number[] = [];
    currentSessionId: string | null = null; /* Added for it to work for me, might class with other implementation */
    selectedGenreIds: number[] = [];
    selectedSeededIds: any[] = [];
    minRating: number = 0;
    minRuntime: number = 0;
    maxRuntime: number = 400;
    curMovieId: number = 550;
    movieDetailsPrmsState: PromiseState = {promise: null, data: null, error: null};
    movieVideosPrmsState: PromiseState = {promise: null, data: null, error: null};
    movieIdQueuePrmsState: PromiseState = {promise: null, data: null, error: null};
    popularMoviesPrmsState: PromiseState = {promise: null, data: null, error: null};
    movieCreditsPrmsState: PromiseState = {promise: null, data: null, error: null};
    imdbRatingPrmsState: PromiseState = {promise: null, data: null, error: null};
    watchProvidersPrmsState: PromiseState = {promise: null, data: null, error: null};
    prefetchWindowPrmsState: PromiseState = {promise: null, data: null, error: null};
    searchMoviesPrmsState: PromiseState = {promise: null, data: null, error: null};
    getRecPrmsState: PromiseState = {promise: null, data: null, error: null};
    getCurrentSessionUsernamesPrmsState: PromiseState = {promise: null, data: null, error: null};
    username: string = ""; // temp placeholder
    alltimeLikedMovieIds: number[] = [];
    alltimeLikedMoviesArray: TMDBMoviePageResult[] = [];
    profilePic: string | undefined = undefined;
    isEnsuringIdQueueHealth: boolean = false;

    // NEW:
    movieDetailsById: { [id: number]: PromiseState } = {};
    PREFETCH_SIZE: number = 5;

    constructor() {
        makeAutoObservable(this);
    }

    setId(id: string | null) {
        this.userId = id;
    }

    // Placeholder
    initiateStart() {
        console.log("Session started");
    }

    setCurrentMovieId(id: number | undefined | void | null) {
        if (!id) return;
        this.curMovieId = id;
    }

    getLatestPrefetchMovieId() {
        if (!this.prefetchWindowPrmsState.data || !Array.isArray(this.prefetchWindowPrmsState.data)) return;
        if (this.prefetchWindowPrmsState.data.length === 0) return;

        const latestId = this.prefetchWindowPrmsState.data[0].id;
        return latestId;
    }

    currentMovieEffect() {
        this.prefetchMovieDetails(this.curMovieId);
        // 2) Point the "active" PromiseState to the one for curMovieId
        const currentState = this.movieDetailsById[this.curMovieId];
        if (currentState) {
            this.movieDetailsPrmsState = currentState;
        }
        this.getCurMovieTrailer();
        this.getCurMovieCredits();
        this.getMovieImdbRating(this.curMovieId);
        this.getCurWatchProviders();

        const movieIdsQueue = this.movieIdQueuePrmsState.data as number[] | null;
        if (!movieIdsQueue) {
            console.log("MovieIdsQueue is empty! call from currentMovieEffect()");
            return;
        }
        else {
            this.ensurePrefetchWindow();
        }
    }

    getCurMovieCredits() {
        const movieCreditsPrms = getMovieCredits(this.curMovieId);
        resolvePromise(movieCreditsPrms, this.movieCreditsPrmsState);
    }

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
    }

    getCurWatchProviders() {
        const watchProvidersPrms = getWatchProviders(this.curMovieId);
        resolvePromise(watchProvidersPrms, this.watchProvidersPrmsState);
        return watchProvidersPrms;
    }

    getMovieImdbRating(id: number) {
        const imdbRatingPrms = getImdbId(id).then(getImdbRating);
        resolvePromise(imdbRatingPrms, this.imdbRatingPrmsState);
    }

    filterAndGetIdsFromMoviesACB(movies: TMDBMoviePageResult[]) {
        const ids: number[] =  [this.curMovieId, ...movies.map(m => m.id)];
        return ids;
    }

    async setMovieIdQueue() {

        const recommendationPrmses = this.selectedSeededIds.map(id => this.getRecommendations(id));
        const recommendationData = await Promise.all(recommendationPrmses);

        let recommendationMovies = recommendationData.flat().filter(movie =>
            movie.genre_ids.some(genre => this.selectedGenreIds.includes(genre)) // filter by selected genres
            && !this.likes.includes(movie.id) // not in liked
            && !this.dislikes.includes(movie.id) // not in disliked            
        );
        recommendationMovies = await filterByRatingAndRuntime(recommendationMovies, this.minRating, this.minRuntime, this.maxRuntime);

        const idQueuePrms = getFilteredPopularMovies(0, 30, this.likes, this.dislikes, this.selectedGenreIds, this.minRating, this.minRuntime, this.maxRuntime)
            .then((popularMovies) => {
                const ids = [...recommendationMovies, ...popularMovies].map(movie => movie.id); // our queue
                return [...new Set(ids)] // removes duplicates
            })
        
        resolvePromise(idQueuePrms, this.movieIdQueuePrmsState);
        return idQueuePrms;
    }

    async ensureMovieIdQueueHealth() {
        if (!Array.isArray(this.movieIdQueuePrmsState.data) || !this.movieIdQueuePrmsState.data) return;

        if (this.movieIdQueuePrmsState.data.length < 18 && !this.isEnsuringIdQueueHealth) {
            this.isEnsuringIdQueueHealth = true;
            const popularMovies = await getFilteredPopularMovies(30, 100, this.likes, this.dislikes, this.selectedGenreIds, this.minRating, this.minRuntime, this.maxRuntime);
            const newIdQueue = [...this.movieIdQueuePrmsState.data, ...popularMovies.map(movie => movie.id)];
            this.movieIdQueuePrmsState.data = [...new Set(newIdQueue)]; // removes duplicates
            this.isEnsuringIdQueueHealth = false;
        }
    }

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
    }

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
    }

    fetchPopularMovies() {
        const prms = fetchMoviesPages(getPopularMovies, 1, 1);
        
        // Gets list for Home View
        resolvePromise(prms, this.popularMoviesPrmsState);

        return prms;
    }

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
    }

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
    }

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
    }

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
    }

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
    }

    setMinRating(rating: number) {
        this.minRating = rating;
    }

    setRuntime(min: number, max: number) {
        this.minRuntime = min;
        this.maxRuntime = max;
    }

    nextMovie() {
        const movieIdsQueue = this.movieIdQueuePrmsState.data;
        if (!movieIdsQueue) { return };
        movieIdsQueue.shift(); 
        this.ensureMovieIdQueueHealth();
        this.curMovieId = movieIdsQueue[0];
    }

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
    }

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
    }

    fetchGenres() {
        const genresPrms = getMovieList().then((data: any) => {
            if (data && data.genres) {
                this.setGenres(data.genres);
            }
            return data;
        });
        resolvePromise(genresPrms, this.genresPrmsState);
        return genresPrms
    }

    setGenres(genres: any[]) {
        this.genres = genres;
    }

    setSessionId(sessionId: string | null) {
        this.currentSessionId = sessionId;
    }

    getCurrentSessionId() {
        return this.currentSessionId;
    }

    setUsername(username: string) {
        this.username = username;
    }

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
    }

    addToLiked(id: number) {
        this.likes.push(id);
    }
    addToDisliked(id: number) {
        this.dislikes.push(id);
    }
}
