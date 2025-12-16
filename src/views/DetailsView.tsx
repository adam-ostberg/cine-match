import "../style.css"
import { type MovieDetails, type TMDBCast, type TMDBCrew, type WatchProvider, type CountryWatchOptions, type TMDBGenre, type TMDBVideoType, type TMDBMovieCredits, type WatchProvidersResponse, } from "../apiConfig";
import { observer } from "mobx-react-lite";
import { minutesToHourAndMinutesText, getCountryCode } from "../helperFunctions";
import { useState, useEffect, useRef } from "react";
/* npm install react-icons */
import { FaArrowLeft, FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaFire, FaUserCircle } from "react-icons/fa";
import imdbLogo from "../assets/imdb_logo_2016.svg";

export type DetailsViewProps = {
  details: MovieDetails;
  video: TMDBVideoType;
  credits: TMDBMovieCredits;
  imdb: number;
  watchProviders: WatchProvidersResponse;
  onClose: () => void;
};

/* Based on https://www.cineby.gd/movie/812583 */

const DetailsView = observer(
  function DetailsViewRender(props: DetailsViewProps) {

    // State
    const [showVideo, setShowVideo] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const background = document.querySelector(".details-view-background");
    
    function openDetailsViewAnimation() {
      const detailContainer = document.getElementById(`details-container ${details.id}`);
      
      if (!!detailContainer) { 
        //detailsScrollableArea?.classList.add("hide-scrollbar");
        detailContainer.style.top = "100%";
        detailContainer.style.scrollbarWidth = "none";
        background?.classList.add("is-dark");
       }
      setTimeout(() => {
        if (!!detailContainer) { 
          detailContainer.style.top = "0"; 
        }
      }, 50);
    }
    function hideScrollbarDuringAnimation() {
      const detailsScrollableArea = document.querySelector(".details-scrollable-area");
      detailsScrollableArea?.classList.add("hide-scrollbar");
      setTimeout(() => {
        detailsScrollableArea?.classList.remove("hide-scrollbar");
      }, 800);
    }
    //hideScrollbarDuringAnimation();

    // https://stackoverflow.com/q/74245335
    useEffect(() => {
      // Only run animation once on mount
      openDetailsViewAnimation();
    }, []);

    const details = props.details;
    const cast = props.credits.cast;
    const crew = props.credits.crew;
    const countryCode = getCountryCode();
    // const countryName = new Intl.DisplayNames(["en"], { type: "region" });
    const watchProviders = props.watchProviders.results[countryCode];
    const imdbRating = props.imdb
    const TMDB_BASE_URL = "https://image.tmdb.org/t/p/";
    const video = props.video
    const LOGO_SIZE_URL = "original";
    const PROFILE_SIZE_URL = "w185";
    const BACKDROP_URL = `${TMDB_BASE_URL}/original${details.backdrop_path}`;
    /* const LOGO_URL = TMDB_BASE_URL + POSTER_WIDTH_URL + details.logo_path; */

    // enablejsapi=1 is crucial for custom controls to work
    // from https://avada.com/documentation/youtube-video-parameters/
    // => https://developers.google.com/youtube/player_parameters#ParametersParameters
    // https://developers.google.com/youtube/iframe_api_reference
    const trailerUrl = video
      ? `https://www.youtube.com/embed/${video.key}?autoplay=1&controls=0&loop=1&playlist=${video.key}&rel=0&iv_load_policy=3&fs=0&modestbranding=1&enablejsapi=1`
      : null;

    const runtimeText = minutesToHourAndMinutesText(Number(details.runtime));
    const year = details.release_date ? details.release_date.split("-")[0] : "";

    // Popularity Color Logic
    // [TODO] Make a range
    const popularityScore = details.popularity;
    let popColor = "white";
    if (popularityScore > 400) popColor = "#e50914"; // Red hot
    else if (popularityScore > 200) popColor = "#ffbf00"; // Orange

    function closeACB() {
      props.onClose();
    }
    function getDirector(crew: TMDBCrew[]): TMDBCrew | undefined {
      const director = crew.find(person => person.job == "Director");
      return director
    }
    function getTopThreeWriters(crew: TMDBCrew[]): Array<TMDBCrew> {
      const writers = crew.filter(person => person.department === "Writing").slice(0, 2);
      return writers;
    }
    function getTopActors(cast: TMDBCast[]): Array<TMDBCast> {
      const actors = cast.filter(person => person.known_for_department === "Acting"); // Only actors have a .order key
      const topSixActors = actors.filter(person => person.order < 8).sort((a, b) => a.order - b.order);
      return topSixActors;
    }

    function toggleMuteACB() {
      if (!iframeRef.current) return;
      const action = isMuted ? "unMute" : "mute";
      // Post message to YouTube Iframe API
      // from https://medium.com/@mihauco/youtube-iframe-api-without-youtube-iframe-api-f0ac5fcf7c74
      iframeRef.current.contentWindow?.postMessage(`{"event":"command","func":"${action}"}`, '*');
      setIsMuted(!isMuted);
    }

    /* function peopleTextOutput(people: TMDBCast[] | TMDBCrew[], headerText: string) {
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
    } */

    function filterAndSortWatchProviders(options: CountryWatchOptions) {
      if (!options) {
        return [];
      }
      const providers = [...options.rent ?? [], ...options.buy ?? [], options.flatrate ?? []] as WatchProvider[];
      const uniqueProviders = [
        ...new Map(providers.map(p => [p.provider_id, p])).values()
      ];

      return uniqueProviders.sort((a, b) => a.display_priority - b.display_priority);
    }
    function outputWatchProviders(provider: WatchProvider) {
      return (
        <div key={provider.provider_id} className="detail-card provider">
          <a /* href={watchProviders.link} */> {/* Goes to TMDB site, not correct link */}
            <img src={TMDB_BASE_URL + LOGO_SIZE_URL + provider.logo_path} alt="" />
            <span className="name">{provider.provider_name}</span>
          </a>
        </div>
      );
    }

    const director = getDirector(crew);
    const topActors = getTopActors(cast);
    const validProviders = filterAndSortWatchProviders(watchProviders);

    function handleMainPlayButtonACB() {
      if (!showVideo) {
        // First time click: Show video and start state as playing
        setShowVideo(true);
        setIsPlaying(true);
        // iframe will autoplay due to URL param, but state needs to match
      } else {
        // Toggle existing video
        if (!iframeRef.current) return;
        const action = isPlaying ? "pauseVideo" : "playVideo";
        // Post message to YouTube Iframe API
        // from https://medium.com/@mihauco/youtube-iframe-api-without-youtube-iframe-api-f0ac5fcf7c74
        iframeRef.current.contentWindow?.postMessage(`{"event": "command", "func": "${action}"}`, '*');
        setIsPlaying(!isPlaying);
      }
    }

    function renderGenreCB(genre: TMDBGenre) {
      return <span key={genre.id} className="details-genre-chip">{genre.name}</span>;
    }

    function renderActorCB(actor: TMDBCast) {
      return (
        <div key={actor.id} className="detail-card actor">
          {actor.profile_path ? (
            <img className="headshot" src={TMDB_BASE_URL + PROFILE_SIZE_URL + actor.profile_path} alt={actor.name} />
          ) : (
            <FaUserCircle className="no-image" />
          )}
          <span className="name">{actor.name}</span>
          <span className="role">{actor.character}</span>
        </div>
      )
    }
    return (
      <div className="details-container" id={`details-container ${details.id}`}>

        {/* Background layer */}
        <div className="details-background">
          {trailerUrl && showVideo ? (
            <iframe
              ref={iframeRef}
              className="details-video-frame"
              src={trailerUrl}
              title="Movie Trailer"
              allow="autoplay; encrypted-media; loop;"
            />
          ) : (
            <img src={BACKDROP_URL} alt="Background" className="details-fallback-img" />
          )}

          <div className="details-overlay-gradient"></div>
        </div>

        <div className="details-scrollable-area hide-scrollbar">

          {/* Main section */}
          <div className="details-content-layer">

            <div className="details-top-bar">
              <button onClick={closeACB} className="details-nav-btn back">
                <FaArrowLeft />
              </button>
              {trailerUrl && showVideo && (
                <div className="details-video-controls">
                  <button onClick={toggleMuteACB} className="details-nav-btn control">
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                </div>
              )}
            </div>
            {/* All movie info */}
            <div className="details-info-wrapper">
              <h1 className={`details-title ${isPlaying ? "hide" : ""}`}>{details.title}</h1>
              {/* The meta info row */}
              <div className={`details-meta-row ${isPlaying ? "hide" : ""}`}>
                <span className="meta-item">{year}</span>
                <span className="meta-dot">•</span>
                <span className="meta-item">{runtimeText}</span>
                <span className="meta-dot">•</span>
                <div className="meta-rating imdb">
                  <img src={imdbLogo} alt="IMDb" className="meta-imdb-logo" />
                  <span>{imdbRating ? imdbRating.toFixed(1) : details.vote_average.toFixed(1)}</span>
                </div>
                <span className="meta-dot">•</span>
                <div className="meta-rating popularity" style={{ color: popColor }}>
                  <FaFire />
                  <span>{Math.round(details.popularity)}</span>
                </div>
              </div>

              <div className={`details-genres-row ${isPlaying ? "hide" : ""}`}>
                {details.genres.slice(0, 3).map(renderGenreCB)}
              </div>

              <p className={`details-overview ${isPlaying ? "hide" : ""}`}>{details.overview}</p>

              <div className="details-actions-row">
                {video && (
                  <button className="primary-button" onClick={handleMainPlayButtonACB}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                    <span>{isPlaying ? " Pause Trailer" : " Play Trailer"}</span>
                  </button>)}
                <button className="secondary-button" title="Add to Liked">
                  +
                </button>
              </div>
            </div>
          </div>

          {/* MORE INFO SECTION */}
          <div className="details-more-info">
            {director && (
              <div className="details-section">
                <h3>Director</h3>
                {/* From renderActor */}
                {director.profile_path ? (
                  <img className="headshot" src={TMDB_BASE_URL + PROFILE_SIZE_URL + director.profile_path} alt={director.name} />
                ) : (
                  <FaUserCircle className="no-image" />
                )}
                <p className="director-name">{director ? director?.name : ""}</p>
              </div>
            )}
            {topActors.length > 0 && (
              <div className="details-section">
                <h3>Top Cast</h3>
                <div className="details-grid-row">
                  {topActors.map(renderActorCB)}
                </div>
              </div>
            )}
            {validProviders.length > 0 && (
              <div className="details-section">
                <h3>Where to Watch</h3>
                <div className="details-grid-row">
                  {validProviders.map(outputWatchProviders)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
)

export { DetailsView };