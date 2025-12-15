import "../style.css"
import { type CountryWatchOptions, type MovieDetails, type SpokenLanguages, type TMDBCast, type TMDBCrew, type TMDBGenre, type TMDBMovieCredits, type TMDBVideoType, type WatchProvider, type WatchProvidersResponse } from "../apiConfig";
import { observer } from "mobx-react-lite";
import { getVideoUrl, minutesToHourAndMinutesText, getCountryCode } from "../helperFunctions";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


export type DetailsViewProps = {
  details: MovieDetails;
  video: TMDBVideoType;
  credits: TMDBMovieCredits;
  imdb: number;
  watchProviders: WatchProvidersResponse;
  onClose: () => void;
  //trailerKey: string | null;
};

function openDetailsViewAnimation() {
  const detailContainer = document.getElementById("details-container");
  const movieBg = document.getElementById("movie-bg");
  if (!!detailContainer) { detailContainer.style.top = "100%";}
  setTimeout(() => {
    if (!!detailContainer) { detailContainer.style.top = "0";}
  }, 200);
}

const DetailsView = observer(
  function DetailsViewRender(props: DetailsViewProps) {

    openDetailsViewAnimation();

    const details = props.details;
    const cast = props.credits.cast;
    const crew = props.credits.crew;
    const countryCode = getCountryCode();
    const countryName = new Intl.DisplayNames(["en"], { type: "region" });
    const watchProviders = props.watchProviders.results[countryCode];
    const imdbRating = props.imdb
    const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";
    const POSTER_WIDTH_URL = "w780/";
    const LOGO_SIZE_URL = "w185";
    const POSTER_URL = TMDB_BASE_URL + POSTER_WIDTH_URL + details.poster_path;

    const HAS_TRAILER = !!props.video;
    const videoUrl = HAS_TRAILER ? getVideoUrl(props.video)?? undefined : undefined;
    const videoBox = !!videoUrl ? <iframe className="trailer-video" src={videoUrl}></iframe> : "";

    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });

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
        if (i < people.length-1) {
          text += person.name + ", ";
        }
        else {
          text += person.name;
        }
        i += 1;
      }
      return <li><b>{headerText}</b>{text}</li>
    }
    function outputSpokenLanguagesCB(language: SpokenLanguages, index: number, array: SpokenLanguages[]) {
      if (!language) { return };

      return index < array.length-1 ? `${language.english_name}, ` : `${language.english_name}`;
    }
    function outputOriginCountryCB(countryCode: string, index: number, array: string[]) {
      if (!countryCode) { return };
      const country = countryName.of(countryCode);
      return index < array.length-1 ? `${country}, ` : `${country}`; 
    }
    function outputBoxOfficeValue(value: number, header: string) {
      if (!value || value <= 0) { return };
      return <li><b>{header}: </b>{value.toLocaleString("en-us")}$</li>;
    }
    function outputBoxOffice(budget: number, revenue: number) {
      if (budget <= 0 && revenue < 0) return;

      return (
        <div>
          <h2>Box Office</h2>
          <ul>
            {outputBoxOfficeValue(details.budget, "Budget")}
            {outputBoxOfficeValue(details.revenue, "Revenue")}
          </ul>
        </div>
      );
    }
    function filterAndSortWatchProviders(options: CountryWatchOptions) {
      if (!options) {
        return [];
      }
      const providers = [...options.rent?? [], ...options.buy?? [], options.flatrate?? []] as WatchProvider[];
      const uniqueProviders = [
        ...new Map(providers.map(p => [p.provider_id, p])).values()
      ];

      return uniqueProviders.sort((a, b) => a.display_priority - b.display_priority);
    }
    function outputWatchProviders(provider: WatchProvider) {
      return (
        <div key={provider.provider_id} className="watch-provider-column">
          <a href={watchProviders.link}>
            <img src={TMDB_BASE_URL + LOGO_SIZE_URL + provider.logo_path} alt=""/>
            {provider.provider_name}
          </a>
        </div>
      );
    }

    const director = getDirector(crew);
    const writers = getTopThreeWriters(crew);
    const actors = getTopThreeActors(cast);
    const runtimeText = minutesToHourAndMinutesText(Number(details.runtime));

    return (
      <div className="details-container" id="details-container">

        <div className="movie-bg" id="movie-bg">
          <img src={POSTER_URL} alt="Movie poster background" />
        </div>
        <div className="details-content">
          <IconButton className="close-button" onClick={closeACB} aria-label="close">
            <CloseIcon/>
          </IconButton>

          <div className="details-header">
            <div className="details-header-info">
              <h1>{details.title}</h1>
              <div>{details.release_date.split("-")[0]} - {runtimeText}</div>
            </div>
            <div className="details-header-metrics">
              <div className="imdb-rating">
                <img src='src/assets/imdb_logo.png' alt="IMDB Rating"/> {/* [TODO] Use imdB logo for the src */}
                <span>{imdbRating}</span>
              </div>
              <div className="popularity">
                <img src="src/assets/popularity.png" alt="TMDB Popularity" />
                <span>{details.popularity.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="media-section">
            <img className="poster"
              src={POSTER_URL}
            />
            {videoBox}
            <div className="media-section-sidebar">
              <p>JustWatch Providers:</p>
              {filterAndSortWatchProviders(watchProviders).slice(0, 8).map(outputWatchProviders)}
            </div>

          </div>
          <div className="details-info">
            <div className="genre-boxes">
              {details.genres.map(genreBoxesCB)}
            </div>
            
            <p className="overview">
              {details.overview}
            </p>

            <h2>Details</h2>
            <ul>
              <li><b>Release date: </b>{dateFormatter.format(new Date(details.release_date))}</li>
              <li><b>Origin Country: </b>{details.origin_country.map(outputOriginCountryCB)}</li>
              <li><b>Languages: </b> {details.spoken_languages.map(outputSpokenLanguagesCB)}</li>
            </ul>

            <h2>Cast & Crew</h2>
            <ul>
              <li><b>Director: </b>{director?.name}</li>
              {peopleTextOutput(writers, "Writer: ")}
              {peopleTextOutput(actors, "Actors: ")}
            </ul>
            
            {outputBoxOffice(details.budget, details.revenue)}
          </div>
        </div>
      </div>
    );
  }
)

export { DetailsView };