import "../style.css";

import type { TMDBPopularMovieResult } from "../apiConfig";

export type HomeViewProps = {
  movies: TMDBPopularMovieResult[] | null;
  onStartSession: () => void;
  onMovieClick: (id: number) => void;
}

export function HomeView(props: HomeViewProps) {
  function onLogoClickACB() {
    window.location.hash = "#/Home"
  };
  return (
    <div className="home">
      <h1 onClick={onLogoClickACB}>CineMatch</h1>
      <p>Swipe to find your perfect movie</p>
      <button className="primary-button" onClick={() => window.location.hash = "#/swipe"}>Start Session</button>
    </div>
  );
}
