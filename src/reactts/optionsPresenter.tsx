
import { observer } from "mobx-react-lite";
import { OptionsView } from "../views/OptionsView.tsx";
import type { ModelType } from "../MovieModel.ts";
// import type { TMDBGenre } from "../apiConfig.ts";

export type OptionsPresenterProps = {
    model: ModelType;
}

const Options = observer(
    function OptionsRender(props: OptionsPresenterProps) {

        // Ensure genres are loaded
        if (!props.model.genres || props.model.genres.length === 0) {
            if (!props.model.genresPrmsState.promise && !props.model.genresPrmsState.error) {
                props.model.fetchGenres();
            }
        }

        function onGenreChangeACB(genreId: number) {
            props.model.toggleGenre(genreId);
        }

        function onToggleAllGenresACB() {
            props.model.toggleAllGenres();
        }

        function onRatingChangeACB(newRating: number) {
            props.model.setMinRating(newRating);
        }

        function onRuntimeChangeACB(min: number, max: number) {
            props.model.setRuntime(min, max);
        }

        return (
            <OptionsView
                availableGenres={props.model.genres}
                selectedGenreIds={props.model.selectedGenreIds}
                currentMinRating={props.model.minRating}
                currentMinRuntime={props.model.minRuntime}
                currentMaxRuntime={props.model.maxRuntime}
                onGenreChange={onGenreChangeACB}
                onToggleAll={onToggleAllGenresACB}
                onRatingChange={onRatingChangeACB}
                onRuntimeChange={onRuntimeChangeACB}
            />
        );
    }
);

export { Options }