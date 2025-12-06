
import { observer } from "mobx-react-lite";
import { OptionsView } from "../views/OptionsView.tsx";
import type { ModelType } from "../MovieModel.ts";
import type { TMDBGenre } from "../apiConfig.ts";

export type Genre = {
    id: number;
    name: string;
}

export type OptionsPresenterProps = {
    model: ModelType;
}

const Options = observer(  // needed for the presenter to update (its view) when relevant parts of the model change
    function OptionsRender(/* props: OptionsPresenterProps */) {

        // function onGenreChangeACB(genreId: number) {
        //     props.model.toggleGenre(genreId);
        // }
        // function onRatingChangeACB(newRating: number) {
        //     props.model.setMinRating(newRating);
        // }
        return (
            <OptionsView
            // availableGenres={props.model.genres}
            // selectedGenreIds={props.model.selectedGenreIds}
            // currentMinRating={props.model.minRating}

            // onGenreChange={onGenreChangeACB}
            // onRatingChange={onRatingChangeACB}
            />
        );
    }
);



export { Options }