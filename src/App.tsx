import { HomeView } from "./views/HomeView";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { OptionsView } from "./views/OptionsView";
import { SwipeView } from "./views/SwipeView";
import { DetailsView } from "./views/DetailsView";
import { model, type ModelType } from "./MovieModel"
import { Details } from "./reactts/detailsPresenter";
import { observer } from "mobx-react-lite";

export type AppRenderProps = {
	model: ModelType
}

const App = observer(
	function AppRender(props: AppRenderProps) {
		function makeRouter(){
			return createHashRouter([
				{
						path: "/",
						element: <HomeView/>,
				},/*
				{
						path: "/options",
						element: <OptionsView/>,
				},
				{
						path: "/swipe",
						element: <SwipeView/>,
				},
				*/
				{
						path: "/details",
						element: <Details model={props.model}/>
				}
			]);
		}
		const router = makeRouter();

		return (
		<div className="mainContent">
				<RouterProvider router={router}/>
		</div>      
		);
	}
)


export { App }
