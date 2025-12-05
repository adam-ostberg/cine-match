import "../style.css"
import type { Genre } from "../reactts/optionsPresenter.tsx";
import type { TMDBGenre } from "../apiConfig.ts";

export type OptionsViewProps = {
  availableGenres: TMDBGenre[];
  selectedGenreIds: number[];
  currentMinRating: number;

  onGenreChange: (id: number) => void;
  onRatingChange: (rating: number) => void;
}

function mapGenresCB(genre: Genre) {
  return (
    <div>{genre.name}</div>
  );
}

export function OptionsView(props: OptionsViewProps) {
  console.log(props.availableGenres);
  return (
    <div className="options-section">
      <h2>Filter movies</h2>
      <div className="genres-section">
        <h3>Genres</h3>
        <div className="genres-selection">
          {props.availableGenres.map(mapGenresCB)}
        </div>
      </div>
    </div>
  );
}