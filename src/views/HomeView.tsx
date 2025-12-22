import "../style.css";

import type { TMDBMoviePageResult } from "../apiConfig";
import { Navbar } from "../reactts/navbarPresenter";
import type { UserModel } from "../UserModel";
import type { SessionModel } from "../SessionModel";

export type HomeViewProps = {
  userModel: UserModel;
  sessionModel: SessionModel;
  sessionId: string | null;
  movies: TMDBMoviePageResult[] | null;
  username: string | null;
  onStartSession: () => void;
  onJoinSession: (sessionId: string) => void;
  onMovieClick: (id: number) => void;
  onExitSession: () => void;
}

export function HomeView(props: HomeViewProps) {

  const movies = props.movies || [];

  // Duplicate array for infinite scroll
  const infiniteMovies = [...movies, ...movies];

  function onStartSessionClickACB() {
    props.onStartSession();

  }

  function onJoinSessionClickACB() {
    const sessionIdInput = document.getElementById("session-id-input") as HTMLInputElement;
    const sessionId = sessionIdInput.value;
    props.onJoinSession(sessionId);

  }

  function onContinueSwipingACB() {
    window.location.hash = "#/swipe";
  }

  function exitSessionACB() {
    props.onExitSession();
  }

  /* function onStartSessionClickCB() { // For future implementation
    props.onStartSession();
  } */

  function renderMovieCardCB(movie: TMDBMoviePageResult, index: number) {
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

  const introText = props.userModel.currentUser
    ? `Create a session and invite some friends to decide which movie to watch!`
    : `CineMatch helps you and your friends decide upon a movie to watch. Create an account and invite your friends to a session to begin swiping until you find your perfect movie match!`;

return (
    <div className="home">
      <Navbar userModel={props.userModel} sessionModel={props.sessionModel}/>
      <div className="home-section">
        <div className="home-intro">
          <p>{introText}</p>
        </div>
        <div className="carousel-view">
          <div className="carousel-track">
            {infiniteMovies.map(renderMovieCardCB)}
          </div>
        </div>
        {props.userModel.currentUser?.uid ? (
          props.sessionId ? (
            <div className="currently-in-session-section">
              <p>You are currently in a session</p>
              <button className="primary-button" onClick={onContinueSwipingACB}>Continue swiping</button>
              <p>or</p>
              <button className="destructive-button" onClick={exitSessionACB}>Exit Session</button>
            </div>
          ) : (
            <div className="session-section">
              <button className="primary-button" onClick={onStartSessionClickACB}>Create Session</button>
              <p>or</p>
              <div className="join-session-input">
                <input id="session-id-input" type="text" placeholder="Enter Session ID" inputMode="numeric" pattern="\d*" />
                <button className="secondary-button" onClick={onJoinSessionClickACB}>Join Session</button>
              </div>
            </div>
          )
        ) : (
          <div className="session-section">
            <p>Please log in to create or join a session...</p>
						<button className="secondary-button" style={{fontSize: "22px", width: "200px"}} onClick={() => { window.location.hash = "#/account" }}>
							Log In
						</button>
          </div>
        )}
        
      </div>
    </div>
  );
}