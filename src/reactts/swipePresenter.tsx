
import { observer } from "mobx-react-lite";
import { SwipeView } from "../views/SwipeView";
import type { ModelType } from "../MovieModel";
import { NavBarView } from "../views/NavbarView";

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
		function navBarlogoClickedACB() {

		}

		const ALL_DATA_FETCHED = !! model.movieIdQueuePrmsState.data && !!model.movieDetailsPrmsState.data;
		const view = ALL_DATA_FETCHED ? <SwipeView model={model} onDislike={swipeDislikeACB} onLike={swipeLikeACB}/> : "__loading__";

		return (
			<div className="swipe-flex-parent">
				<NavBarView onLogoClick={navBarlogoClickedACB}/>
				{view}
			</div>
		);
	}
);

export { Swipe }