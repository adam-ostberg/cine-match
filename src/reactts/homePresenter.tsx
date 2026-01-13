
import { observer } from "mobx-react-lite";
import { HomeView } from "../views/HomeView.tsx";
import type { TMDBMoviePageResult } from "../apiConfig.ts";
// import type { PromiseState } from "../resolvePromise.ts";
import { MovieModel } from "../MovieModel.ts";
import { useState } from "react";
import { DetailsView } from "../views/DetailsView.tsx";
import { UserModel } from "../UserModel.ts";
import { SessionModel } from "../SessionModel.ts";

export type HomePresenterProps = {
    model: MovieModel;
    userModel: UserModel;
    sessionModel: SessionModel;
}

const Home = observer(
    function HomeRender(props: HomePresenterProps) {
        const [showDetails, setShowDetails] = useState(false); // State to control details overlay
        function sessionStartACB() {
            if (!props.userModel.currentUser) {
                alert("Please log in first.");
                return;
            }
            props.userModel.createSessionAction();
            props.model.clearMovieFilters();
            props.model.setCurrentMovieId(props.model.getLatestPrefetchMovieId());
        }

        function sessionJoinACB(sessionId: string) {
            if (!props.userModel.userId) {
                alert("Please log in first.");
                return;
            }
            props.model.clearMovieFilters();
            props.userModel.joinSessionAction(sessionId);
        }

        if (!props.model.popularMoviesPrmsState.data) {
            console.log("Loading..."); // ==> SuspenseView
        }

        function onMovieClickedACB(id: number) {
            setShowDetails(true);
            props.model.setCurrentMovieId(id);
        }
        
        function closeDetailsACB() {
            if (!showDetails) return;
			const background = document.querySelector(".details-view-background"); 
			background?.classList.remove("is-dark");
            setShowDetails(false); // Hide details overlay
        }

        // Make the user exit the current session
        function handleExitSessionACB() {
            const userId = props.userModel.userId;

            if (userId) {
                props.sessionModel.removeUser(userId);
            }
            props.sessionModel.setSessionId(null);
            props.userModel.setCurrentSessionId(null);
            props.model.clearMovieFilters();
        }

		const HAS_ALL_DETAILS_DATA = (
			!!props.model.movieDetailsPrmsState.data
			&& !!props.model.movieCreditsPrmsState.data
			&& !!props.model.imdbRatingPrmsState.data
			&& !!props.model.watchProvidersPrmsState.data
		);
		const details = showDetails && HAS_ALL_DETAILS_DATA 
            ? <DetailsView 
                details={props.model.movieDetailsPrmsState.data} 
                video={props.model.movieVideosPrmsState.data} 
                credits={props.model.movieCreditsPrmsState.data} 
                imdb={props.model.imdbRatingPrmsState.data} 
                watchProviders={props.model.watchProvidersPrmsState.data} 
                onClose={closeDetailsACB}/> 
            : "";

        const username = props.userModel.currentUser && props.userModel.username || null;

        return (
            <div className="home-presenter-parent">
                <div className="details-view-background" onClick={closeDetailsACB}>
                    <HomeView
                        movieModel={props.model}
                        userModel={props.userModel}
                        sessionModel={props.sessionModel}
                        sessionId={props.userModel.currentSessionId || null}
                        sessionStatus={props.sessionModel.status}
                        onStartSession={sessionStartACB}
                        username={username}
                        onJoinSession={sessionJoinACB}
                        movies={(props.model.popularMoviesPrmsState.data as TMDBMoviePageResult[]) || []}
                        onMovieClick={onMovieClickedACB}
                        onExitSession={handleExitSessionACB}
                    />
                </div>
                {details}
            </div>
        );
    }
);



export { Home }
