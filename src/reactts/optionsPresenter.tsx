
import { observer } from "mobx-react-lite";
import { OptionsView } from "../views/OptionsView.tsx";
import type { ModelType } from "../MovieModel.ts";
import type { TMDBGenre } from "../apiConfig.ts";
import { getMovieList } from "../apiConfig.ts";

export type Genre = {
    id: number;
    name: string;
}

export type OptionsPresenterProps = {
    model: ModelType;
    genres: TMDBGenre[];
}

const Options = observer(  // needed for the presenter to update (its view) when relevant parts of the model change
    function OptionsRender(props: OptionsPresenterProps) {
        function onGenreChangeACB(genreId: number) {
            // TODO
        }
        function onRatingChangeACB(newRating: number) {
            // TODO
        }

        return (
            <OptionsView
                availableGenres={props.model.genres}
                selectedGenreIds={[1, 2, 3]}
                currentMinRating={3}

                onGenreChange={onGenreChangeACB}
                onRatingChange={onRatingChangeACB}
            />
        );
    }
);



export { Options }