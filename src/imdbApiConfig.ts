const BASE_URL = "https://api.imdbapi.dev";
const optionsGET = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

/* From https://imdbapi.dev */

/* export */ type ImdbResponse = {
  rating: {
    aggregateRating: number;
  };
};

/* export */ type BatchImdbResponse = {
  titles: ImdbResponse[];
};

export function getImdbRating(titleId: string): Promise<number | null> {
  const ENDPOINT = `/titles/${titleId}`;

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: ImdbResponse) {
    return data.rating.aggregateRating;
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
    return null
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}

export function getBatchImdbRating(titleIds: string[]): Promise<number[] | null> { // Can fetch a maximum of 5 ids at a time
  const params = new URLSearchParams();
  titleIds.forEach(id => params.append("titleIds", id));

  const ENDPOINT = `/titles:batchGet?${params.toString()}`;

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: BatchImdbResponse) {
    return data.titles.map(movie => movie.rating.aggregateRating);
  }

  function handleErrorACB(error: unknown) {
    console.error(error);
    return null
  }

  return fetch(BASE_URL + ENDPOINT, optionsGET)
    .then(handleResponseACB)
    .then(handleSuccessACB)
    .catch(handleErrorACB);
}

/* getImdbRating("tt0137523").then((data) => {
  console.log(data);
}); */
/*
const titleIds = [
  'tt0111161',
  'tt0068646',
  'tt0468569'
];

const data = await getBatchImdbRating(titleIds);
console.log(data);
*/