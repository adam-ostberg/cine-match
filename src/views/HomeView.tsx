import "../style.css";

import type { TMDBPopularMovieResult } from "../apiConfig";

export type HomeViewProps = {
  movies: TMDBPopularMovieResult[] | null;
  onStartSession: () => void;
  onJoinSession: (sessionId: string) => void;
  onMovieClick: (id: number) => void;
}

export function HomeView(props: HomeViewProps) {

  const movies = props.movies || [];

  // Duplicate array for infinite scroll
  const infiniteMovies = [...movies, ...movies];

  function onLogoClickACB() {
    window.location.hash = "#/";
  }

  function onStartSessionClickACB() {
    props.onStartSession();
    window.location.hash = "#/swipe";
  }

  function onJoinSessionClickACB() {
    const sessionIdInput = document.getElementById("session-id-input") as HTMLInputElement;
    const sessionId = sessionIdInput.value;
    props.onJoinSession(sessionId);

    window.location.hash = "#/swipe";
  }

  /* function onStartSessionClickCB() { // For future implementation
    props.onStartSession();
  } */

  function renderMovieCardCB(movie: TMDBPopularMovieResult, index: number) {
    function onMovieClickCB() {
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
      {/*TODO: PUT THIS BUTTON SOMEWHERE ELSE*/}
      <button onClick={() => window.location.hash="#/account"}>Go To Account Page</button>
      <div className="carousel-view">
        <div className="carousel-track">
          {infiniteMovies.map(renderMovieCardCB)}
        </div>
      </div>
      <div className="session-section">
        <button className="primary-button" onClick={onStartSessionClickACB}>Create Session</button>
        <p>or</p>
        <div className="join-session-input">
          <input id="session-id-input" type="text" placeholder="Enter Session ID" inputMode="numeric" pattern="\d*" />
          <button className="secondary-button" onClick={onJoinSessionClickACB}>Join Session</button>
        </div>
      </div>
    </div>
  );
}
