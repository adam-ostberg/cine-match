import "../style.css";

import type { TMDBPopularMovieResult } from "../apiConfig";

export type HomeViewProps = {
  movies: TMDBPopularMovieResult[] | null;
  onStartSession: () => void;
  onMovieClick: (id: number) => void;
}

export function HomeView(props: HomeViewProps) {

  const movies = props.movies || [];

  // Duplicate array for infinite scroll (maybe stupid solution?)
  const infiniteMovies = [...movies, ...movies];

  function onLogoClickACB() {
    window.location.hash = "#/home";
  }

  /* function onStartSessionClickCB() { // For future implementation
    props.onStartSession();
  } */

  function renderMovieCardCB(movie: TMDBPopularMovieResult, index: number) {
    function onMovieClickCB(evt: any) {
      props.onMovieClick(movie.id);
    }

    return (
      <a
        key={`${movie.id} ${index}`} // Unique key for array rendering (since IDs are duplicated)
        className="movie-card"
        onClick={onMovieClickCB}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
      </a>
    );
  }

  /* if (!props.movies) {
    return <div><p>Loading movies...</p></div>;
  } */

  return (
    <div className="home">
      <h1 onClick={onLogoClickACB}>CineMatch</h1>
      <p>Swipe to find your perfect movie</p>
      <div className="carousel-view">
        <div className="carousel-track">
          {infiniteMovies.map(renderMovieCardCB)}
        </div>
      </div>
      <button className="primary-button" onClick={() => window.location.hash = "#/swipe"}>Start Session</button>
    </div>
  );
}
