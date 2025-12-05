import "../style.css"
import { type MovieDetails, type TMDBCast, type TMDBCrew, type TMDBGenre, type TMDBMovieCredits, type TMDBVideoType } from "../apiConfig";
import { observer } from "mobx-react-lite";
import { getVideoUrl } from "../helperFunctions";

export type DetailsViewProps = {
  details: MovieDetails;
  video: TMDBVideoType;
  credits: TMDBMovieCredits;
  imdb: number;
  onClose: () => void;
  //trailerKey: string | null;
};

const DetailsView = observer(
  function DetailsViewRender(props: DetailsViewProps) {
    const details = props.details;
    const cast = props.credits.cast;
    const crew = props.credits.crew;
    const imdbRating = props.imdb
    const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";
    const POSTER_WIDTH_URL = "w780/";

    const POSTER_URL = TMDB_BASE_URL + POSTER_WIDTH_URL + details.poster_path;

    const HAS_TRAILER = !!props.video;

    const videoUrl = HAS_TRAILER ? getVideoUrl(props.video)?? "#" : "#";
    const videoBox = !!videoUrl ? <iframe className="trailer-video" src={videoUrl}></iframe> : <p>No trailer available.</p>;
    function closeACB() {
      props.onClose();
    }
    function genreBoxesCB(genre: TMDBGenre) {
      return <div className="genre-box">{genre.name}</div>;
    }
    function getDirector(crew: TMDBCrew[]): TMDBCrew | undefined {
      const director = crew.find(person => person.job == "Director");
      return director
    }
    function getTopThreeWriters(crew: TMDBCrew[]): Array<TMDBCrew> {
      const writers = crew.filter(person => person.department === "Writing").slice(0, 2);
      return writers;
    }
    function getTopThreeActors(cast: TMDBCast[]): Array<TMDBCast> {
      const actors = cast.filter(person => person.known_for_department === "Acting"); // Only actors have a .order key
      const topThreeActors = actors.filter(person => person.order < 3).sort((a, b) => a.order - b.order);
      return topThreeActors;
    }
    function peopleTextOutput(people: TMDBCast[] | TMDBCrew[], headerText: string) {
      let text = "";
      let i = 0;
      for (const person of people) {
        if (i < people.length) {
          text += person.name + ", ";
        }
        else {
          text += person.name;
        }
        i += 1;
      }
      return <li>{headerText}{text}</li>
    }
    const director = getDirector(crew);
    const writers = getTopThreeWriters(crew);
    const actors = getTopThreeActors(cast);

    return (
      <div className="details-container">

        <div className="movie-bg">
          <img src={POSTER_URL} alt="Movie poster background" />
        </div>
        <div className="details-content">
        <button className="close-button" onClick={closeACB}>
          Close
        </button>


        <div className="details-header">
          <h1>{details.title}</h1>

        </div>
        
        <div className="media-section">
          <img className="poster"
            src={POSTER_URL}
          />
          {videoBox}
          <div className="media-section-sidebar">
            <div className="imdb-rating">
              <img src='src/assets/imdb_logo.png' /> {/* [TODO] Use imdB logo for the src */}
              <span>{imdbRating}</span>
            </div>
            <div className="popularity">
              <img src="src/assets/popularity.png" alt="" />
              <span>{details.popularity}</span>
            </div>

          </div>

        </div>
        <div className="details-info">
          <div className="genre-boxes">
            {details.genres.map(genreBoxesCB)}
          </div>
          
          <p className="overview">
            {details.overview}
          </p>

          <ul>
            <li>Director: {director?.name}</li>
            {peopleTextOutput(writers, "Writer: ")}
            {peopleTextOutput(actors, "Actors: ")}
          </ul>
          
        </div>
        </div>
      </div>
    );
  }
)

export { DetailsView };