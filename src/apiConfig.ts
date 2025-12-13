const BASE_URL = "https://api.themoviedb.org/3";
const optionsGET = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2N2NlNGQ5YWZmYWRhN2RiZGZjNjA1YmYwNDljNzAzYyIsIm5iZiI6MTc2NDE1OTY0MC4xMTYsInN1YiI6IjY5MjZmMDk4Nzk4ZDU0YmJlMmMxMWY4NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5ERg42s4DbAtiLHNtlMbqVIGOXYD3f0MP8YtAjTHE-c",
  },
};

export type ProductionCompany = {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
};
export type ProductionCountry = {
  iso_3166_1: string;
  name: string;
}

export type TMDBGenre = {
  id: number;
  name: string;
}

export type SpokenLanguages = {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export type MovieDetails = {
  adult: false,
  backdrop_path: string, // jpg file path f.e "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg"
  belongs_to_collection: boolean,
  budget: number,
  genres: TMDBGenre[],
  homepage: string,
  id: number,
  imdb_id: string, // f.e "tt0137523"
  origin_country: string[], // example ["US"]
  original_language: string, // example "en"
  original_title: string,
  overview: string, // Summary text
  popularity: number,
  poster_path: string, // jpg path file f.e
  production_companies: ProductionCompany[],
  production_countries: ProductionCountry[],
  release_date: string, // YYYY-MM-DD
  revenue: number,
  runtime: number, // number of minutes
  spoken_languages: SpokenLanguages[],
  status: string, // f.e "released"
  tagline: string, // f.e 'Mischief. Mayhem. Soap.'
  title: string, // f.e 'Fight Club'
  video: boolean,
  vote_average: number,
  vote_count: number
}

export type MovieList = {
  genres: TMDBGenre[];
}


export function apiAuth() {
  const ENDPOINT = "/authentication";

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    return data;
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}

export function getGenres() {
  const ENDPOINT = "/genre/movie/list";

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    return data;
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}

export type TMDBsearchData = {
  query: string;
  include_adult?: boolean;
  language?: string;
  primary_release_year?: string;
  page?: number;
  region?: string;
  year?: string;
};

export function searchTMDBMovies(searchParams: TMDBsearchData) {
  /* OBS: Det finns en distinkt skillnad mellan "discover"
    och "search" (Discover kan bl.a. ha fler parametrar)
    Beroende på kanske denna ändras till discover. */
  /* https://developer.themoviedb.org/reference/search-movie */

  const ENDPOINT = "/search/movie";

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    return data;
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(
    BASE_URL + ENDPOINT + "?" + new URLSearchParams(searchParams as any),
    optionsGET
  )
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}

export function getMovieDetails(movie_id: number) {
  const ENDPOINT = `/movie/${movie_id}`;

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    return data;
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}

export function getMovieImages(movie_id: number) {
  /* Kanske inte ett måste, man får med get movie details */

  const ENDPOINT = `/movie/${movie_id}/images`;

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    return data;
    // [TODO] specify the one with the best vote_count?
    // Also, specify aspect ratio for poster? Resolution
    // Finns backdrops, logos, posters.
    // Använd "logos" som png vid film-beskrivning
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}



export type TMDBVideoType = {
  iso_639_1: string, // ex: 'en'
  iso_3166_1: string, // ex: 'US'
  name: string,
  key: string, // ex: 'V0Fqdb-smqo'
  site: string, // ex: 'YouTube'
  size: number, // 2160
  type: string, // ex: 'Featurette'
  official: boolean,
  published_at: string, // ex: '2025-02-14T14:25:16.000Z'
  id: string, // ex: '67c90f7a3dd7da394f24957b'
}


export type TMDBVideoResults = {
  id: number,
  results: TMDBVideoType[],
}


export function getMovieVideos(movie_id: number): Promise<TMDBVideoResults | any> {
  /* Gets the movie videos */

  const ENDPOINT = `/movie/${movie_id}/videos`;

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    return data;
    // [TODO] specify the type: "Trailer", (with the greatest size?)
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}


export interface TMDBMoviePageResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface TMDBMoviePage {
  page: number;
  results: TMDBMoviePageResult[];
  total_pages: number;
  total_results: number;
}

export function getPopularMovies(page: number): Promise<any>{
  /* We get a list of popular movies to populate a search screen */

  const ENDPOINT = "/movie/popular";
  const PARAMS = `?page=${page}`;

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    return data;
    // Gets poster path
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(BASE_URL + ENDPOINT + PARAMS, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}

export async function fetchMoviesPages(
  fetcherFn: (page: number) => Promise<TMDBMoviePage>,
  pagesToFetch: number,
  startPage = 1
): Promise<TMDBMoviePageResult[]> {

  if (pagesToFetch < 1) {
    return [];
  }

  const endPage = startPage + pagesToFetch - 1;

  // Build an array of promises for each page
  const pagePromises: Promise<TMDBMoviePage>[] = [];
  for (let page = startPage; page <= endPage; page++) {
    pagePromises.push(fetcherFn(page));
  }

  // Fetch all pages in parallel
  const pageResults = await Promise.all(pagePromises);

  // Merge all results into one array
  const allMovies = pageResults.flatMap((res) => res.results);

  return allMovies;
}


export function getRecommendedMovie(movie_id: number, page: number = 1): Promise<void | TMDBMoviePage> {
  const ENDPOINT = `/movie/${movie_id}/recommendations`;
  // Add the page parameter to the URL
  const PARAMS = `?page=${page}`; 

  function handleResponseACB(response: Response) {
    if (response.ok !== true) throw new Error();
    return response.json();
  }

  function handleSuccessACB(data: any) {
    return data as TMDBMoviePage;
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
    throw error;
  }

  return fetch(BASE_URL + ENDPOINT + PARAMS, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}


/* export */ type ExternalIDs = {
  id: number;
  imdb_id: string | null;
};

export function getImdbId(movie_id: number): Promise<any> {
  const ENDPOINT = `/movie/${movie_id}/external_ids`;

  function handleResponseACB(response: Response) {
    if (!response.ok) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: ExternalIDs) {
    return data.imdb_id;
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}


// One streaming / rent / buy provider
export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

// All options for a specific country (AE, AL, AR, AT, etc.)
export interface CountryWatchOptions {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

// Whole response object
export interface WatchProvidersResponse {
  id: number;
  results: Record<string, CountryWatchOptions>;
  // ex: results["SE"], results["US"], results["AR"], ...
}

export function getWatchProviders(movie_id: number): Promise<WatchProvidersResponse | any> {
  const ENDPOINT = `/movie/${movie_id}/watch/providers`;

  function handleResponseACB(response: Response) {
    if (!response.ok) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: ExternalIDs) {
    return data;
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}



export type TMDBCast = {
  adult: boolean,
  gender: number,
  id: number,
  known_for_department: string, // ex: "Acting"
  name: string,
  original_name: string,
  popularity: number,
  profile_path: string, // ex: "/8nytsqL59SFJTVYVrN72k6qkGgJ.jpg"
  cast_id: number,
  character: string, // ex: "The Narrator"
  credit_id: string, // ex: "52fe4250c3a36847f80149f3"
  order: number,
}

export type TMDBCrew = {
  adult: boolean,
  gender: number,
  id: number,
  known_for_department: string, // ex: "Acting"
  name: string,
  original_name: string,
  popularity: number,
  profile_path: string, // ex: "/8nytsqL59SFJTVYVrN72k6qkGgJ.jpg"
  credit_id: string, // ex: "52fe4250c3a36847f80149f3"
  order: number,
  department: string,
  job: string, // This only exist if known_for_department !== "Acting"
}

export type TMDBMovieCredits = {
  id: number;
  cast: TMDBCast[];
  crew: TMDBCrew[];
}


export function getMovieCredits(movie_id: number): Promise<void | TMDBMovieCredits> {
  /* From this we can get related movie IDs, image paths, etc. */
  /* Sort by original_language to ensure english movies? */
  /* Sort by popularity? */

  const ENDPOINT = `/movie/${movie_id}/credits`;

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: TMDBMovieCredits) {
    return data;
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}

/* getGenres().then((data) => {
  console.log(data);
});
 */
/* run with node --loader ts-node/esm apiConfig.ts 
movie_id ex is fight club: 550*/

export function getMovieList() {
  const ENDPOINT = "/genre/movie/list";

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    return data;
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}