import { Home } from "./reactts/homePresenter"; // Make sure path is correct
import { createHashRouter, RouterProvider } from "react-router-dom";
// import { OptionsView } from "./views/OptionsView";
import { type ModelType } from "./MovieModel"
import { Details } from "./reactts/detailsPresenter";
import { observer } from "mobx-react-lite";
import { Swipe } from "./reactts/swipePresenter";
import { Options } from "./reactts/optionsPresenter";
import { Account } from "./reactts/accountPresenter";
import { Profile } from "./reactts/profilePresenter";
import { Lobby } from "./reactts/lobbyPresenter";
import type { SessionType } from "./SessionModel";
import type { UserModelType } from "./UserModel";
import { MatchAnimationView } from "./views/matchAnimationView.tsx";

export type AppRenderProps = {
	model: ModelType
	sessionModel: SessionType
	userModel: UserModelType;
}

const App = observer(
	function AppRender(props: AppRenderProps) {
		function makeRouter() {
			return createHashRouter([
				{
					path: "/",
					element: <Home userModel={props.userModel} model={props.model} sessionModel={props.sessionModel}/>,
				},
				{
					path: "/test-animation",
					element: <MatchAnimationView />,
				},
				{
					path: "/options",
					element: <Options model={props.model} />,
				},
				{
					path: "/swipe",
					element: <Swipe model={props.model} sessionModel={props.sessionModel} userModel={props.userModel}/>,
				},

				{
					path: "/details",
					element: <Details model={props.model} />
				},
				{
					path: "/account",
					element: <Account model={props.model} userModel={props.userModel}/>
				},
				{
					path: "/profile",
					element: <Profile model={props.model} />
				},
				{
					path: "/lobby",
					element: <Lobby model={props.model} sessionModel={props.sessionModel} userModel={props.userModel}/>
				},
			]);
		}
		const router = makeRouter();

		return (
			<div className="mainContent">
				<RouterProvider router={router} />
			</div>
		);
	}
)


export { App }
