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

/* getImdbRating("tt0137523").then((data) => {
  console.log(data);
}); */
