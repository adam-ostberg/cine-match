
import { observer } from "mobx-react-lite";
import { SwipeView } from "../views/SwipeView";

/* [TODO] Alltså har ingen aning om detta är korrekt gjort */

export type SwipeModel = {
    currentMovie: {
        movie_id: number;
        title: string;
        poster_path: string;
        overview: string;
    };
    handleDislike: () => void;
    handleLike: () => void;
}

export type SwipePresenterProps = {
    model: SwipeModel;
}

const Swipe = observer(  // needed for the presenter to update (its view) when relevant parts of the model change
    function SwipeRender(props: SwipePresenterProps) {

        /* if (!props.model.currentMovie) {
            return <SuspenseView />;
        } */

        function swipeDislikeACB() {
            props.model.handleDislike();
        }

        function swipeLikeACB() {
            props.model.handleLike();
        }

        return (
            <SwipeView
                movie={props.model.currentMovie}
                onDislike={swipeDislikeACB}
                onLike={swipeLikeACB}
            />
        );
    }
);

export { Swipe }