
import { observer } from "mobx-react-lite";
import { SwipeView } from "../views/SwipeView";
import type { MovieModel } from "../MovieModel";
import { Navbar } from "../reactts/navbarPresenter";
import { getGenres } from "../apiConfig";
import { DetailsView } from "../views/DetailsView";
import { useState, useEffect, useRef } from "react";
import type { UserModel } from "../UserModel";
import type { SessionModel } from "../SessionModel";
import { resolvePromise, type PromiseState } from "../resolvePromise";

export type SwipePresenterProps = {
	userModel: UserModel;
	sessionModel: SessionModel;
	model: MovieModel;
}

const Swipe = observer(  // needed for the presenter to update (its view) when relevant parts of the model change
	function SwipeRender(props: SwipePresenterProps) {
		const [showDetails, setShowDetails] = useState(false); // State to control details overlay
		const [isMatchDetail, setIsMatchDetail] = useState(false);

		// Ref to keep the previous swipe card when there's a match
		const previousCardMovieIdRef = useRef<number | null>(null);

		function swipeDislikeACB(id: number) {
			props.model.addToDisliked(id);
			props.model.nextMovie();
			console.log("Disliked");
		}

		function swipeLikeACB(id: number) {
			const currentMovie = props.model.prefetchWindowPrmsState.data[0];

			// Report the swipe to the model
			if (currentMovie) {
				props.userModel.reportSwipe(currentMovie.id, currentMovie.title, currentMovie.poster_path || "", true);
			}
			props.model.addToLiked(id);
			props.model.insertRecommendedMovieIntoQueue(id);
			props.model.nextMovie();
			console.log("Liked");
		}
		
		function moreInfoClickedACB() {
			props.model.setCurrentMovieId(props.model.getLatestPrefetchMovieId());
			setShowDetails(true);
		}

		useEffect(() => {
			if (props.sessionModel.showMatchAnimation && props.sessionModel.currentMatchId) {
				// point the state to the matched movie
				if (previousCardMovieIdRef.current === null) {
					previousCardMovieIdRef.current = props.model.curMovieId;
				}
				props.model.setCurrentMovieId(props.sessionModel.currentMatchId);
				props.model.currentMovieEffect();

				// Wait for the animation (1.8s) then show the details
				const timer = setTimeout(() => {
					setShowDetails(true);
					setIsMatchDetail(true);
				}, 1800);

				return () => clearTimeout(timer);
			}
		}, [props.sessionModel.showMatchAnimation, props.sessionModel.currentMatchId]);

		function closeDetailsACB() {
			if (!showDetails) return;
			const background = document.querySelector(".details-view-background");
			background?.classList.remove("is-dark");

			if (isMatchDetail) {
				setIsMatchDetail(false);
				props.sessionModel.processQueue();
				if (previousCardMovieIdRef.current !== null) {
                props.model.setCurrentMovieId(previousCardMovieIdRef.current);
                props.model.currentMovieEffect(); // Trigger fetch to restore the view's data
                previousCardMovieIdRef.current = null; // Clear the ref
            }
			}
			setShowDetails(false); // Hide details overlay
		}
		const genreListPrmsState: PromiseState = {promise: null, data: null, error: null};
		const genreListPrms = getGenres();
		resolvePromise(genreListPrms, genreListPrmsState);

		const HAS_ALL_DETAILS_DATA = (
			!!props.model.movieDetailsPrmsState.data
			&& !!props.model.movieCreditsPrmsState.data
			&& !!props.model.imdbRatingPrmsState.data
			&& !!props.model.watchProvidersPrmsState.data
		)
		
		const view = (
			<SwipeView prefetchWindowPrmsState={props.model.prefetchWindowPrmsState} 
			onDislike={swipeDislikeACB} onLike={swipeLikeACB} onMoreInfo={moreInfoClickedACB} 
			currentSessionId={props.model.currentSessionId} sessionModel={props.sessionModel}
			userModel={props.userModel} sessionShowMatchAnimation={props.sessionModel.showMatchAnimation}
			participants={props.sessionModel.participants} isFetchingIdQueue={props.model.isFetchingIdQueue}
			movieIdToFilterStatus={props.model.movieIdToFilterStatus}
			/>);

		const details = showDetails && HAS_ALL_DETAILS_DATA 
		? <DetailsView 
			details={props.model.movieDetailsPrmsState.data} 
			video={props.model.movieVideosPrmsState.data} 
			credits={props.model.movieCreditsPrmsState.data} 
			imdb={props.model.imdbRatingPrmsState.data} 
			watchProviders={props.model.watchProvidersPrmsState.data} 
			onClose={closeDetailsACB}
			isMatched={isMatchDetail}
			selGenreIds={props.model.selectedGenreIds}
		/> 
		: "";

		return (
			<div className="swipe-flex-parent">
				<div className="details-view-background" onClick={closeDetailsACB}>
					<Navbar movieModel={props.model} userModel={props.userModel} sessionModel={props.sessionModel}/>
					{view}
				</div>
				{details}
			</div>
		);
	}
);

export { Swipe }