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

export function OptionsView(/* props: OptionsViewProps */) {
  return <p>Options</p>;
}