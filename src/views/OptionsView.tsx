import "../style.css"
import type { TMDBGenre } from "../apiConfig.ts";
import { type TMDBMoviePage, type TMDBMoviePageResult } from "../apiConfig.ts";
import type { PromiseState } from "../resolvePromise";
/* From https://mui.com/material-ui/react-slider/ */
/* Inspired by https://www.themoviedb.org/movie */
import Slider from '@mui/material/Slider';
/* npm install react-icons */
import { FaCheckCircle } from "react-icons/fa";

export type OptionsViewProps = {
  availableGenres: TMDBGenre[];
  selectedGenreIds: number[];
  seededMovieIds: number[];
  currentMinRating: number;
  currentMinRuntime: number;
  currentMaxRuntime: number;

  searchResults: TMDBMoviePage | null;
  searchStatus: PromiseState;
  onSearch: (query: string) => void;
  onSelectMovie: (id: number) => void;

  onGenreChange: (id: number) => void;
  onToggleAll: () => void;
  onRatingChange: (rating: number) => void;
  onRuntimeChange: (min: number, max: number) => void;
}

export function OptionsView(props: OptionsViewProps) {

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      props.onSearch(input.value);
    }
  }

  function handleSearchClick() {
    const input = document.getElementById("seed-search-input") as HTMLInputElement;
    if (input) {
      props.onSearch(input.value);
    }
  }

  function renderSearchResultCB(movie: TMDBMoviePageResult) {
    const isSelected = props.seededMovieIds.includes(movie.id);
    if (!movie.poster_path) return null; // Skip movies without images for UI
    function selectMovieACB() {
      props.onSelectMovie(movie.id)
    }
    return (
      <div key={movie.id} className="seed-result-card" onClick={selectMovieACB}>
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}>
        </img>
        {isSelected ? <FaCheckCircle className="checkmark" /> : <></>}
        <span className="seed-result-title">{movie.title}</span>
      </div>
    )
  }

  function renderGenreCB(genre: TMDBGenre) {
    const isSelected = props.selectedGenreIds.includes(genre.id);

    function genreClickACB() {
      props.onGenreChange(genre.id);
    }

    return (
      <button
        key={genre.id}
        className={`genre-option ${isSelected ? "selected" : ""}`}
        /* [TODO] Change to primary-button? secondary-button? For consistency*/
        onClick={genreClickACB}
      >
        {genre.name}
      </button>
    );
  }

  function handleRatingChangeACB(event: Event, newValue: number | number[]) {
    event
    props.onRatingChange(Number(newValue));
  }

  function handleRuntimeChangeACB(event: Event, newValue: number | number[]) {
    event
    if (Array.isArray(newValue)) {
      props.onRuntimeChange(newValue[0], newValue[1]);
    }
  }

  const isAllSelected = props.availableGenres.length > 0 && props.selectedGenreIds.length === props.availableGenres.length;

  return (
    <div className="options-container">
      <h2>Filters</h2>
      <div className="section">

        <h3>Find Movies Like...</h3>
        <p className="sub-text">Like a specific movie? Add it here to find similar ones!</p>
        <div className="search-row">
          <input
            id="seed-search-input"
            type="text"
            placeholder="Search for a movie (e.g. Inception)"
            onKeyDown={handleSearchKeyDown}
          />
          <button className="secondary-button" onClick={handleSearchClick}>Search</button>
        </div>

        {props.searchResults ? (
          <div className="seed-results-container">
            {
              props.searchResults.results.map(renderSearchResultCB)}
          </div>
        ) : ""}

        {!props.searchStatus.data && props.searchStatus.promise && (
          <p>Searching...</p>
        )}

        {/* <div>[TODO] Add selected similar movies carousel, like the home carousel, but swipeable</div> */}
        {/* Also add "watched" movies */}
      </div>

      <div className="section">
        <h3>Minimum IMDB Rating: {props.currentMinRating}</h3>
        <Slider className="imdb-slider"
          onChange={handleRatingChangeACB}
          valueLabelDisplay="auto"
          min={0}
          max={10}
          step={0.1}
          value={props.currentMinRating}
        />
      </div>
      <div className="section">
        <h3>Genres</h3>
        <button className={`genre-option ${isAllSelected ? "selected" : ""} all`} onClick={props.onToggleAll}>
          {isAllSelected ? "Deselect All" : "Select All"}
        </button>
        <div className="genre-list">
          {props.availableGenres.map(renderGenreCB)}
        </div>
      </div>
      <div className="section">
        <h3>Movie Runtime</h3>
        <div>
          <p>
            {props.currentMinRuntime} minutes - {props.currentMaxRuntime} minutes
          </p>
          <Slider className="slider"
            value={[props.currentMinRuntime, props.currentMaxRuntime]}
            onChange={handleRuntimeChangeACB}
            valueLabelDisplay="auto"
            min={0}
            max={400}
            step={15}
            marks
          />
        </div>
      </div>
    </div>
  );
}