import { Home } from "./reactts/homePresenter"; // Make sure path is correct
import { createHashRouter, RouterProvider } from "react-router-dom";
import { OptionsView } from "./views/OptionsView";
import { type ModelType } from "./MovieModel"
import { Details } from "./reactts/detailsPresenter";
import { observer } from "mobx-react-lite";
import { Swipe } from "./reactts/swipePresenter";

export type AppRenderProps = {
	model: ModelType
}

const App = observer(
	function AppRender(props: AppRenderProps) {
		function makeRouter() {
			return createHashRouter([
				{
					path: "/",
					element: <Home model={props.model} />,
				},/*
				{
						path: "/options",
						element: <OptionsView/>,
				}, */
				{
					path: "/swipe",
					element: <Swipe model={props.model} />,
				},

				{
					path: "/details",
					element: <Details model={props.model} />
				}
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
