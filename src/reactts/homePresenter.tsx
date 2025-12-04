
import { observer } from "mobx-react-lite";
import { HomeView } from "../views/HomeView.tsx";
import type { TMDBPopularMovieResult } from "../apiConfig.ts";
import type { PromiseState } from "../resolvePromise.ts";


export type HomeModel = {
    initiateStart: () => void;
    getPopularMovies: () => void;
    popularMoviesPrmsState: PromiseState;
    setCurrentMovieId: (id: number) => void;
}

export type HomePresenterProps = {
    model: HomeModel;
}

const Home = observer(  // needed for the presenter to update (its view) when relevant parts of the model change
    function HomeRender(props: HomePresenterProps) {

        function sessionStartACB() {
            props.model.initiateStart()
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
                movies={props.model.popularMoviesPrmsState.data as TMDBPopularMovieResult[] | null}
                onMovieClick={onMovieClickedACB}
            />
        );
    }
);



export { Home }