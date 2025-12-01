import "/src/style.css"

export type MovieDetails = {
  title: string;
  logo_path: string;
  poster_path: string;
  overview: string;
  rating?: number;
  trailer_key?: string;
}

export type DetailsViewProps = {
  movie: MovieDetails;
  onClose: () => void;
}

export function DetailsView(props: DetailsViewProps) {

  function closeACB() {
    props.onClose();
  }

  return (
    <div className="details-container">
      <button className="close-button" onClick={closeACB}>
        Close
      </button>

      <div className="details-content">
        {/* Poster och logo */}
        <div className="logo-image">
          <img>
            src={props.movie.logo_path}
          </img>
        </div>
        <div className="poster-image">
          <img
            src={props.movie.poster_path}
          />
        </div>

        {/* Movie title */}
        <div className="details-info">
          <h1>{props.movie.title}</h1>

          <div className="rating">
            <img src='#' /> {/* [TODO] Use imdB logo for the src */}
            <span> {props.movie.rating} </span>
          </div>
          <p className="overview">
            {props.movie.overview}
          </p>
          {/* [TODO] Trailer imbed */}
          <a className="trailer-video" href={`https://www.youtube.com/watch?v=${props.movie.trailer_key}`}>
          </a>
        </div>
      </div>
    </div>
  );
}