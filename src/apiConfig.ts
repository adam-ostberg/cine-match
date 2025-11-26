const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2N2NlNGQ5YWZmYWRhN2RiZGZjNjA1YmYwNDljNzAzYyIsIm5iZiI6MTc2NDE1OTY0MC4xMTYsInN1YiI6IjY5MjZmMDk4Nzk4ZDU0YmJlMmMxMWY4NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5ERg42s4DbAtiLHNtlMbqVIGOXYD3f0MP8YtAjTHE-c'
  }
};

fetch('https://api.themoviedb.org/3/authentication', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));