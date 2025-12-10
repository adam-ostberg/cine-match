
import { observer } from "mobx-react-lite";
import { SwipeView } from "../views/SwipeView";
import type { ModelType } from "../MovieModel";
import { NavBarView } from "../views/NavbarView";
import type { MovieDetails } from "../apiConfig";

/* [TODO] Alltså har ingen aning om detta är korrekt gjort */

export type SwipePresenterProps = {	
	model: ModelType
}

const Swipe = observer(  // needed for the presenter to update (its view) when relevant parts of the model change
	function SwipeRender(props: SwipePresenterProps) {

		function swipeDislikeACB() {
			props.model.nextMovie();
			console.log("Disliked");
		}

		function swipeLikeACB() {
			const currentMovie = props.model.movieDetailsPrmsState.data;

			// Report the swipe to the model
			if (currentMovie) {
				props.model.reportSwipe(currentMovie.id, currentMovie.title, currentMovie.poster_path || "", true);
			}
			props.model.nextMovie();
			console.log("Liked");
		}

		function navBarlogoClickedACB() {
			window.location.hash = "#/";
		}

		function moreInfoClickedACB() {
			document.location.hash = "/details";
		}

		const data = props.model.prefetchWindowPrmsState.data as MovieDetails[];
		const ALL_DATA_FETCHED = !!data && data.length >= 2 && !!data[0] && !!data[1];
		
		const view = <SwipeView prefetchWindowPrmsState={props.model.prefetchWindowPrmsState} onDislike={swipeDislikeACB} onLike={swipeLikeACB} onMoreInfo={moreInfoClickedACB} currentSessionId={props.model.currentSessionId}/>;

		return (
			<div className="swipe-flex-parent">
				<NavBarView onLogoClick={navBarlogoClickedACB}/>
				{view}
			</div>
		);
	}
);

export { Swipe }