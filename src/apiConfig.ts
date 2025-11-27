const optionsGET = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2N2NlNGQ5YWZmYWRhN2RiZGZjNjA1YmYwNDljNzAzYyIsIm5iZiI6MTc2NDE1OTY0MC4xMTYsInN1YiI6IjY5MjZmMDk4Nzk4ZDU0YmJlMmMxMWY4NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5ERg42s4DbAtiLHNtlMbqVIGOXYD3f0MP8YtAjTHE-c",
  },
};

const BASE_URL = "https://api.themoviedb.org/3";

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

export type searchData = {
  query: "string";
  region: "string";
  year: "string";
};

function searchMovies(searchParams: searchData) {
  /* OBS: Det finns en distinkt skillnad mellan "discover"
    och "search". Beroende på kanske denna ändras till discover. */
  /* https://developer.themoviedb.org/reference/search-movie */

  const ENDPOINT = "/search/movie";

  const QUERY = searchParams.query;

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
    BASE_URL + ENDPOINT + "?" + new URLSearchParams(QUERY),
    optionsGET
  )
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}

function getMovieDetails(movie_id: Int32Array) {
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

function getMovieImages(movie_id: Int32Array) {
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

function getTrailer(movie_id: Int32Array) {
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

function getSimilarMovie(movie_id: Int32Array) {
  /* From this we can get related movie IDs, image paths, etc. */

  const ENDPOINT = `/movie/${movie_id}/similar`;

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    console.log(data); // [TODO] specify the type: "Trailer", (with the greatest size?)
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}
