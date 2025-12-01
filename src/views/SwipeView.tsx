import "../style.css"

/* [TODO] Alltså har ingen aning om detta är korrekt gjort */

export type Movie = {
  title: string;
  poster_path: string;
  overview: string;
}

export type SwipeViewProps = {
  movie: Movie;
  onDislike: () => void;
  onLike: () => void;
}

export function SwipeView(props: SwipeViewProps) {

  function leftSwipeACB() {
    /* Vi har currentmovie så måste inte ha parametrar */
    props.onDislike
  }
  function rightSwipeACB() {
    props.onLike

  }

  return (
    <div className="swipe-container">
      <div className="movie-card">
        <img
          src={props.movie.poster_path}
          alt={props.movie.title}
        />
        <p>{props.movie.title}</p>
        <button>more info...</button>
      </div>

      <div className="controls">
        <button onClick={props.onDislike}>
          Dislike
        </button>
        <button onClick={props.onLike}>
          Like
        </button>
        <button>more info...</button> {/* 2 buttons for more info – one outside one inside the card? */}
      </div>
    </div>
  );
}