
import { observer } from "mobx-react-lite";
import { HomeView } from "/src/views/HomeView.jsx";

const Sidebar = observer(             // needed for the presenter to update (its view) when relevant parts of the model change
    function HomeRender(props){
        
        function sessionStartACB(evt) {
            props.model.initiateStart(evt)
        }

        return (
        <HomeView number = {props.model.numberOfGuests}
                            dishes = {props.model.dishes}
                            onStartSession = {sessionStartACB}
                            />
        );
    }
);

export { Sidebar }