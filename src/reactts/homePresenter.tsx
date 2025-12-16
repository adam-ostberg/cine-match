
import { observer } from "mobx-react-lite";
import { HomeView } from "../views/HomeView.tsx";
import type { TMDBMoviePageResult } from "../apiConfig.ts";
// import type { PromiseState } from "../resolvePromise.ts";
import { createSession, joinSession, listenToSession } from "../firestoreModel.ts";
import { type ModelType } from "../MovieModel.ts";
import { useState } from "react";
import { DetailsView } from "../views/DetailsView.tsx";
/*
export type HomeModel = {
    initiateStart: () => void;
    popularMoviesPrmsState: PromiseState;
    setCurrentMovieId: (id: number) => void;
}
*/

export type HomePresenterProps = {
    model: ModelType;
}

const Home = observer(
    function HomeRender(props: HomePresenterProps) {
        const [showDetails, setShowDetails] = useState(false); // State to control details overlay
        async function sessionStartACB() {
            props.model.setCurrentMovieId(props.model.getLatestPrefetchMovieId());
            if (!props.model.userId) {
                alert("Please log in first.");
                return;
            }
            const sessionId = await createSession(props.model);
            // @ts-ignore  /* [TODO] for npm build, remove */
            const unsubscribe = listenToSession(sessionId, props.model);
        }

        async function sessionJoinACB(sessionId: string) {
            if (!props.model.userId) {
                alert("Please log in first.");
                return;
            }
            await joinSession(props.model, sessionId); // TODO get session ID from user input

            // TODO add this to the model so we can stop listening when leaving the home view
            // @ts-ignore
            const unsubscribe = listenToSession(sessionId, props.model);
        }

        if (!props.model.popularMoviesPrmsState.data) {
            console.log("Loading..."); // ==> SuspenseView
        }

        function onMovieClickedACB(id: number) {
            setShowDetails(true);
            props.model.setCurrentMovieId(id);
            //window.location.hash = "#/details"; // Navigate to details
        }
        
        function closeDetailsACB() {
			const background = document.querySelector(".details-view-background");
			background?.classList.remove("is-dark");
            setShowDetails(false); // Hide details overlay
        }

		const HAS_ALL_DETAILS_DATA = (
			!!props.model.movieDetailsPrmsState.data
			&& !!props.model.movieVideosPrmsState.data
			&& !!props.model.movieCreditsPrmsState.data
			&& !!props.model.imdbRatingPrmsState.data
			&& !!props.model.watchProvidersPrmsState.data
		)
		const details = showDetails && HAS_ALL_DETAILS_DATA ? <DetailsView details={props.model.movieDetailsPrmsState.data} video={props.model.movieVideosPrmsState.data} credits={props.model.movieCreditsPrmsState.data} imdb={props.model.imdbRatingPrmsState.data} watchProviders={props.model.watchProvidersPrmsState.data} onClose={closeDetailsACB}/> : "";

        const username = props.model.userId && props.model.username || null;

        return (
            <div className="home-presenter-parent">
                <div className="details-view-background">
                    <HomeView
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
