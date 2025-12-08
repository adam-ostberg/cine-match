import "../style.css"
import type { TMDBGenre } from "../apiConfig.ts";
/* From https://mui.com/material-ui/react-slider/ */
/* Inspired by https://www.themoviedb.org/movie */
import Slider from '@mui/material/Slider';

export type OptionsViewProps = {
  availableGenres: TMDBGenre[];
  selectedGenreIds: number[];
  currentMinRating: number;
  currentMinRuntime: number;
  currentMaxRuntime: number;

  onGenreChange: (id: number) => void;
  onToggleAll: () => void;
  onRatingChange: (rating: number) => void;
  onRuntimeChange: (min: number, max: number) => void;
}

export function OptionsView(props: OptionsViewProps) {

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

  /*   function handleSimilarMoviesACB() {
      if (!props.similarMoviesTo) {
        <div></div>
      }
      <div className="similar-movies-to">
  
      </div>
    } */

  return (
    <div className="options-container">
      <h2>Filters</h2>
      {/* 
      <div className="section">
        <h3>Filter by movies similar to:</h3>
        <input id="movie-id" type="text" placeholder="Search for movie, actor, director..." inputMode="text" />
        {handleSimilarMoviesACB}
      </div> */}

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