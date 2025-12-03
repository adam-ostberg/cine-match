import { observer } from "mobx-react-lite";
import "../style.css"
import type { ModelType } from "../MovieModel";
import type { MovieDetails } from "../apiConfig";



export type SwipeViewProps = {
  model: ModelType;
  onDislike: () => void;
  onLike: () => void;
}

const SwipeView = observer(
  function SwipeViewRender(props: SwipeViewProps) {

    const details: MovieDetails = props.model.movieDetailsPrmsState.data;
    const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";
    const POSTER_WIDTH_URL = "w200/";
    const poster_path = TMDB_BASE_URL + POSTER_WIDTH_URL + details.poster_path;

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
            src={poster_path}
            alt={details.title}
          />
          <p>{details.title}</p>
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
);

export { SwipeView };
