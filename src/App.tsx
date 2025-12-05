import { HomeView } from "./views/HomeView";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { type ModelType } from "./MovieModel"
import { Details } from "./reactts/detailsPresenter";
import { observer } from "mobx-react-lite";
import { Swipe } from "./reactts/swipePresenter";
import { Options } from "./reactts/optionsPresenter";

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
				},
				{
						path: "/options",
						element: <Options model={props.model}/>,
				},
				{
						path: "/swipe",
						element: <Swipe model={props.model}/>,
				},
				
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
