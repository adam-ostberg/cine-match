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
    const POSTER_WIDTH_URL = "w780/";
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
        <div className="swipe-content">
          <div className="swipe-section">
            <div className="movie-card">
              <img
                src={poster_path}
                alt={details.title}
              />
            </div>
            <div className="title-section">
              <div className="movie-card-title">{details.title}</div>
            </div>
            <div className="controls">
              <button className="dislike-btn" onClick={props.onDislike}>
                Dislike
              </button>
              <button className="like-btn" onClick={props.onLike}>
                Like
              </button>
              <button>more info...</button> {/* 2 buttons for more info – one outside one inside the card? */}
          </div>
        </div>

      </div>

        <div className="swipe-sidebar">

        </div>
      </div>
    );
  }
);

export { SwipeView };
