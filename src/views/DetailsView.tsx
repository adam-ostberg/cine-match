import "../style.css"
import { type MovieDetails } from "../apiConfig";
import { observer } from "mobx-react-lite";


export type DetailsViewProps = {
  details: MovieDetails;
  onClose: () => void;
  trailerKey: () => void; /* This needs to be string | null */
};

const DetailsView = observer(
  function DetailsViewRender(props: DetailsViewProps) {
    const details = props.details
    const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";
    const POSTER_WIDTH_URL = "w200/";

    const POSTER_URL = TMDB_BASE_URL + POSTER_WIDTH_URL + details.poster_path;
    function closeACB() {
      props.onClose();
    }
    function renderTrailer() {
      if (!props.trailerKey) return <div></div>
      return (
        <iframe
          className="trailer-video" src={`https://www.youtube.com/embed/${props.trailerKey}`}
        ></iframe >
      );
    }

    return (
      <div className="details-container">
        <button className="close-button" onClick={closeACB}>
          Close
        </button>

        <div className="details-content">
          {/* Poster */}
          <div className="poster-image">
            <img
              src={POSTER_URL}
            />
          </div>

          {/* Movie title */}
          <div className="details-info">
            <h1>{details.title}</h1>

            <div className="rating">
              <img src='#' /> {/* [TODO] Use imdB logo for the src */}
              <span> {details.vote_average} </span>
            </div>
            <p className="overview">
              {details.overview}
            </p>
            {/* [TODO] Trailer imbed */}
            {renderTrailer()}
          </div>
        </div>
      </div>
    );
  }
)

export { DetailsView };