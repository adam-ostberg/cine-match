
import { observer } from "mobx-react-lite";
import { SwipeView } from "../views/SwipeView";
import type { ModelType } from "../MovieModel";

/* [TODO] Alltså har ingen aning om detta är korrekt gjort */



export type SwipePresenterProps = {
    model: ModelType;
}

const Swipe = observer(  // needed for the presenter to update (its view) when relevant parts of the model change
    function SwipeRender(props: SwipePresenterProps) {
        const model = props.model;
        /* if (!props.model.currentMovie) {
            return <SuspenseView />;
        } */

        function swipeDislikeACB() {
            //props.model.handleDislike();
        }

        function swipeLikeACB() {
            //props.model.handleLike();
        }

        const ALL_DATA_FETCHED = !! model.movieIdQueuePrmsState.data && !!model.movieDetailsPrmsState.data;
        const view = ALL_DATA_FETCHED ? <SwipeView model={model} onDislike={swipeDislikeACB} onLike={swipeLikeACB}/> : "__loading__";

        return (
            view
        );
    }
);

export { Swipe }