
import { observer } from "mobx-react-lite";
import { HomeView } from "../views/HomeView.tsx";
import type { TMDBMoviePageResult } from "../apiConfig.ts";
// import type { PromiseState } from "../resolvePromise.ts";
import { createSession, joinSession, listenToSession } from "../firestoreModel.ts";
import { type ModelType } from "../MovieModel.ts";
import { useState } from "react";
import { DetailsView } from "../views/DetailsView.tsx";
import { hideRootAndMainContentOverflow } from "../helperFunctions.ts";
import type { UserModelType } from "../UserModel.ts";
import type { SessionType } from "../SessionModel.ts";
/*
export type HomeModel = {
    initiateStart: () => void;
    popularMoviesPrmsState: PromiseState;
    setCurrentMovieId: (id: number) => void;
}
*/

export type HomePresenterProps = {
    model: ModelType;
    userModel: UserModelType;
    sessionModel: SessionType;
}

const Home = observer(
    function HomeRender(props: HomePresenterProps) {
        const [showDetails, setShowDetails] = useState(false); // State to control details overlay
        async function sessionStartACB() {
            props.model.setCurrentMovieId(props.model.getLatestPrefetchMovieId());
            if (!props.userModel.currentUser) {
                alert("Please log in first.");
                return;
            }
            const sessionId = await createSession(props.userModel);
            // @ts-ignore  /* [TODO] for npm build, remove */
            const unsubscribe = listenToSession(sessionId, props.model, props.sessionModel);
        }

        async function sessionJoinACB(sessionId: string) {
            if (!props.userModel.userId) {
                alert("Please log in first.");
                return;
            }
            await joinSession(props.userModel, sessionId); // TODO get session ID from user input

            // TODO add this to the model so we can stop listening when leaving the home view
            // @ts-ignore
            const unsubscribe = listenToSession(sessionId, props.model, props.sessionModel);
        }

        if (!props.model.popularMoviesPrmsState.data) {
            console.log("Loading..."); // ==> SuspenseView
        }

        function onMovieClickedACB(id: number) {
            setShowDetails(true);
            //hideRootAndMainContentOverflow();
            props.model.setCurrentMovieId(id);
            //window.location.hash = "#/details"; // Navigate to details
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
		const details = showDetails && HAS_ALL_DETAILS_DATA ? <DetailsView details={props.model.movieDetailsPrmsState.data} video={props.model.movieVideosPrmsState.data} credits={props.model.movieCreditsPrmsState.data} imdb={props.model.imdbRatingPrmsState.data} watchProviders={props.model.watchProvidersPrmsState.data} onClose={closeDetailsACB}/> : "";

        const username = props.userModel.currentUser && props.userModel.username || null;

        return (
            <div className="home-presenter-parent">
                <div className="details-view-background" onClick={closeDetailsACB}>
                    <HomeView
                        userModel={props.userModel}
                        sessionModel={props.sessionModel}
                        onStartSession={sessionStartACB}
                        username={username}
                        onJoinSession={sessionJoinACB}
                        movies={(props.model.popularMoviesPrmsState.data as TMDBMoviePageResult[]) || []}
                        onMovieClick={onMovieClickedACB}
                    />
                </div>
                {details}
            </div>
        );
    }
);



export { Home }
