const BASE_URL = "https://api.themoviedb.org/3";
const optionsGET = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2N2NlNGQ5YWZmYWRhN2RiZGZjNjA1YmYwNDljNzAzYyIsIm5iZiI6MTc2NDE1OTY0MC4xMTYsInN1YiI6IjY5MjZmMDk4Nzk4ZDU0YmJlMmMxMWY4NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5ERg42s4DbAtiLHNtlMbqVIGOXYD3f0MP8YtAjTHE-c",
  },
};

function apiAuth() {
  const ENDPOINT = "/authentication";

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    console.log(data);
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  // Execute fetch using the named callbacks
  fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}

function getGenres() {
  const ENDPOINT = "/genre/movie/list";

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    console.log(data);
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}

/* export */ type searchData = {
  query: string;
  region?: string;
  year?: string;
};

function searchMovies(searchParams: searchData) {
  /* OBS: Det finns en distinkt skillnad mellan "discover"
    och "search" (Discover kan bl.a. ha fler parametrar)
    Beroende på kanske denna ändras till discover. */
  /* https://developer.themoviedb.org/reference/search-movie */

  const ENDPOINT = "/search/movie";

  //   const QUERY = searchParams.query;

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    console.log(data);
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(
    BASE_URL + ENDPOINT + "?" + new URLSearchParams(searchParams),
    optionsGET
  )
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}

function getMovieDetails(movie_id: number) {
  const ENDPOINT = `/movie/${movie_id}`;

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    console.log(data);
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}

function getMovieImages(movie_id: number) {
  /* Kanske inte ett måste, man får med get movie details */

  const ENDPOINT = `/movie/${movie_id}/images`;

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    console.log(data);
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

function getTrailer(movie_id: number) {
  /* Gets the trailer video */

  const ENDPOINT = `/movie/${movie_id}/videos`;

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    console.log(data);
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

function getPopularMovies() {
  /* We get a list of popular movies to populate a search screen */

  const ENDPOINT = "/movie/popular";

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    console.log(data);
    // Gets poster path
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}

function getSimilarMovie(movie_id: number): Promise<void | object> {
  /* From this we can get related movie IDs, image paths, etc. */
  /* Sort by original_language to ensure english movies? */
  /* Sort by popularity? */

  const ENDPOINT = `/movie/${movie_id}/similar`;

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

/* export */ type ExternalIDs = {
  id: number;
  imdb_id: string | null;
};

function getImdbId(movie_id: number): Promise<string | void | null> {
  const ENDPOINT = `/movie/${movie_id}/external_ids`;

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
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

getSimilarMovie(550).then((data) => {
  console.log(data);
});
