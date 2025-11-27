import "/src/style.css"
import type { Genre } from "../reactts/optionsPresenter.tsx";

export type OptionsViewProps = {
  availableGenres: Genre[];
  selectedGenreIds: Int32Array[];
  currentMinRating: number;

  onGenreChange: (id: Int32Array) => void;
  onRatingChange: (rating: number) => void;
}

export function OptionsView(props: OptionsViewProps) {
  return <p>Options</p>;
}