const BASE_URL = "api.imdbapi.dev";
const optionsGET = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

/* From https://imdbapi.dev */

function getImdbRating(titleId: string) {
  const ENDPOINT = `/titles/${titleId}`;

  function handleResponseACB(response: Response) {
    if (response.ok !== true) {
      throw new Error();
    }
    return response.json();
  }

  function handleSuccessACB(data: object) {
    console.log(data); // [TODO] Check comment below for getting rating
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

/* {
  "id": "string",
  "type": "string",
  "isAdult": true,
  "primaryTitle": "string",
  "originalTitle": "string",
  "primaryImage": {
    "url": "string",
    "width": 0,
    "height": 0,
    "type": "string"
  },
  "startYear": 0,
  "endYear": 0,
  "runtimeSeconds": 0,
  "genres": [
    "string"
  ],
  "rating": {
    "aggregateRating": 0,  // HERE [TODO]
    "voteCount": 0
  }, */
