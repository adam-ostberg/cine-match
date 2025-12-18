
import { observer } from "mobx-react-lite";
import { SwipeView } from "../views/SwipeView";
import type { ModelType } from "../MovieModel";
import { Navbar } from "../reactts/navbarPresenter";
import type { MovieDetails } from "../apiConfig";
import { DetailsView } from "../views/DetailsView";
import { useState } from "react";
import { hideRootAndMainContentOverflow } from "../helperFunctions";
import type { UserModelType } from "../UserModel";
/* [TODO] Alltså har ingen aning om detta är korrekt gjort */

export type SwipePresenterProps = {	
	userModel: UserModelType;
	model: ModelType
}

const Swipe = observer(  // needed for the presenter to update (its view) when relevant parts of the model change
	function SwipeRender(props: SwipePresenterProps) {
		const [showDetails, setShowDetails] = useState(false); // State to control details overlay

		function swipeDislikeACB(id: number) {
			props.model.addToDisliked(id);
			props.model.nextMovie();
			console.log("Disliked");
		}

		function swipeLikeACB(id: number) {
			const currentMovie = props.model.movieDetailsPrmsState.data;

			// Report the swipe to the model
			if (currentMovie) {
				props.model.reportSwipe(currentMovie.id, currentMovie.title, currentMovie.poster_path || "", true);
			}
			props.model.addToLiked(id);
			props.model.insertRecommendedMovieIntoQueue(id);
			props.model.nextMovie();

			console.log("Liked");
		}

		function navBarlogoClickedACB() {
			window.location.hash = "#/";
		}

		function moreInfoClickedACB() {
			//hideRootAndMainContentOverflow();
			setShowDetails(true);
			//document.location.hash = "/details";
		}
        function closeDetailsACB() {
			if (!showDetails) return;
			const background = document.querySelector(".details-view-background");
			background?.classList.remove("is-dark");
            setShowDetails(false); // Hide details overlay
			//hideRootAndMainContentOverflow(true);
        }

		const HAS_ALL_DETAILS_DATA = (
			!!props.model.movieDetailsPrmsState.data
			&& !!props.model.movieVideosPrmsState.data
			&& !!props.model.movieCreditsPrmsState.data
			&& !!props.model.imdbRatingPrmsState.data
			&& !!props.model.watchProvidersPrmsState.data
		)
		
		const view = <SwipeView prefetchWindowPrmsState={props.model.prefetchWindowPrmsState} onDislike={swipeDislikeACB} onLike={swipeLikeACB} onMoreInfo={moreInfoClickedACB} currentSessionId={props.model.currentSessionId}/>;

		const details = showDetails && HAS_ALL_DETAILS_DATA ? <DetailsView details={props.model.movieDetailsPrmsState.data} video={props.model.movieVideosPrmsState.data} credits={props.model.movieCreditsPrmsState.data} imdb={props.model.imdbRatingPrmsState.data} watchProviders={props.model.watchProvidersPrmsState.data} onClose={closeDetailsACB}/> : "";

		return (
			<div className="swipe-flex-parent">
				<div className="details-view-background" onClick={closeDetailsACB}>
					<Navbar userModel={props.userModel}/>
					{view}
				</div>
				{details}
			</div>
		);
	}
);

export { Swipe }