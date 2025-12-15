
import { observer } from "mobx-react-lite";
import { OptionsView } from "../views/OptionsView.tsx";
import type { ModelType } from "../MovieModel.ts";
import type { TMDBMoviePage, TMDBMoviePageResult } from "../apiConfig.ts";
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

        function onSearchTextACB(q: string) {
            props.model.searchMovie(q);
        }

        function onSelectSeedMovieACB(movie: TMDBMoviePageResult) {
            props.model.selectSeedMovie(movie.id);
            props.model.toggleAlltimeLike(movie);
        }

        return (
            <OptionsView
                availableGenres={props.model.genres}
                selectedGenreIds={props.model.selectedGenreIds}
                currentMinRating={props.model.minRating}
                currentMinRuntime={props.model.minRuntime}
                currentMaxRuntime={props.model.maxRuntime}
                searchResults={props.model.searchMoviesPrmsState.data as TMDBMoviePage || null}
                searchStatus={props.model.searchMoviesPrmsState}
                onGenreChange={onGenreChangeACB}
                onToggleAll={onToggleAllGenresACB}
                onRatingChange={onRatingChangeACB}
                onRuntimeChange={onRuntimeChangeACB}
                onSearch={onSearchTextACB}
                onSelectMovie={onSelectSeedMovieACB}
                seededMovieIds={props.model.selectedSeededIds}
            />
        );
    }
);

export { Options }