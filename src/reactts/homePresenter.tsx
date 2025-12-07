
import { observer } from "mobx-react-lite";
import { HomeView } from "../views/HomeView.tsx";
import type { TMDBPopularMovieResult } from "../apiConfig.ts";
import type { PromiseState } from "../resolvePromise.ts";
import { createSession, joinSession, listenToSession } from "../firestoreModel.ts";
import { type ModelType } from "../MovieModel.ts";

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

        async function sessionStartACB() {
            if (!props.model.userId) {
                alert("Please log in first.");
                return;
            }
            const sessionId = await createSession(props.model);
            const unsubscribe = listenToSession(sessionId, props.model);
        }

        async function sessionJoinACB(sessionId: string) {
            if (!props.model.userId) {
                alert("Please log in first.");
                return;
            }
            await joinSession(props.model, sessionId); // TODO get session ID from user input
            
            // TODO add this to the model so we can stop listening when leaving the home view
            const unsubscribe = listenToSession(sessionId, props.model);
        }

        if (!props.model.popularMoviesPrmsState.data) {
            console.log("Loading..."); // ==> SuspenseView
        }

        function onMovieClickedACB(id: number) {
            props.model.setCurrentMovieId(id);
            window.location.hash = "#/details"; // Navigate to details
        }

        return (
            <HomeView
                onStartSession={sessionStartACB}
                onJoinSession={sessionJoinACB}
                movies={(props.model.popularMoviesPrmsState.data as TMDBPopularMovieResult[]) || []}
                onMovieClick={onMovieClickedACB}
            />
        );
    }
);



export { Home }
