import "../style.css"
import type { Genre } from "../reactts/optionsPresenter.tsx";

export type OptionsViewProps = {
  availableGenres: Genre[];
  selectedGenreIds: number[];
  currentMinRating: number;

  onGenreChange: (id: number) => void;
  onRatingChange: (rating: number) => void;
}

export function OptionsView(props: OptionsViewProps) {
  return <p>Options</p>;
}