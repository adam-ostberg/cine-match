import "../style.css"
import type { TMDBGenre } from "../apiConfig.ts";

export type OptionsViewProps = {
  availableGenres: TMDBGenre[];
  selectedGenreIds: number[];
  currentMinRating: number;

  onGenreChange: (id: number) => void;
  onToggleAll: () => void;
  onRatingChange: (rating: number) => void;
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

  function handleRatingChangeACB(evt: React.ChangeEvent<HTMLInputElement>) {
    props.onRatingChange(Number(evt.target.value));
  }

  const isAllSelected = props.availableGenres.length > 0 && props.selectedGenreIds.length === props.availableGenres.length;


  return (
    <div className="options-container">
      <h2>Preferences</h2>

      <div className="section">
        <h3>Minimum IMDB Rating: {props.currentMinRating}</h3>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={props.currentMinRating}
          onChange={handleRatingChangeACB}
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
    </div>
  );
}