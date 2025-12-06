
import { observer } from "mobx-react-lite";
import { HomeView } from "../views/HomeView.tsx";
import type { TMDBPopularMovieResult } from "../apiConfig.ts";
import type { PromiseState } from "../resolvePromise.ts";
import { createSession, joinSession } from "../firestoreModel.ts";
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
            await createSession(props.model);
        }

        async function sessionJoinACB(sessionId: string) {
            await joinSession(props.model, sessionId); // TODO get session ID from user input
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
