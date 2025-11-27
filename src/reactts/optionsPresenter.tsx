
import { observer } from "mobx-react-lite";
import { OptionsView } from "../views/OptionsView.tsx";

export type Genre = {
    id: Int32Array;
    name: string;
}

export type OptionsModel = {
    genres: Genre[];
    selectedGenreIds: Int32Array[];
    minRating: number;

    toggleGenre: (id: Int32Array) => void;
    setMinRating: (rating: number) => void;
}

export type OptionsPresenterProps = {
    model: OptionsModel;
}


const Options = observer(  // needed for the presenter to update (its view) when relevant parts of the model change
    function OptionsRender(props: OptionsPresenterProps) {

        function onGenreChangeACB(genreId: Int32Array) {
            props.model.toggleGenre(genreId);
        }
        function onRatingChangeACB(newRating: number) {
            props.model.setMinRating(newRating);
        }
        return (
            <OptionsView
                availableGenres={props.model.genres}
                selectedGenreIds={props.model.selectedGenreIds}
                currentMinRating={props.model.minRating}

                onGenreChange={onGenreChangeACB}
                onRatingChange={onRatingChangeACB}
            />
        );
    }
);



export { Options }