
import { observer } from "mobx-react-lite";
import { HomeView } from "../views/HomeView.tsx";


export type HomeModel = {
    initiateStart: () => void;
}

export type HomePresenterProps = {
    model: HomeModel;
}

const Home = observer(  // needed for the presenter to update (its view) when relevant parts of the model change
    function HomeRender(props: HomePresenterProps) {

        function sessionStartACB() {
            props.model.initiateStart()
        }

        return (
            <HomeView
                onStartSession={sessionStartACB}
            />
        );
    }
);



export { Home }