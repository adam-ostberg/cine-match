import { Home } from "./reactts/homePresenter"; // Make sure path is correct
import { createHashRouter, RouterProvider } from "react-router-dom";
// import { OptionsView } from "./views/OptionsView";
import { type ModelType } from "./MovieModel"
import { Details } from "./reactts/detailsPresenter";
import { observer } from "mobx-react-lite";
import { Swipe } from "./reactts/swipePresenter";
import { Options } from "./reactts/optionsPresenter";
import { Account } from "./reactts/accountPresenter";

export type AppRenderProps = {
	model: ModelType
}
/* 
// From https://youtu.be/xhURh2RDzzg

const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];

function randomFromArray(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function createName() {
	const prefix = randomFromArray([
		"COOL",
		"SUPER",
		"HIP",
		"SMUG",
		"COOL",
		"SILKY",
		"GOOD",
		"SAFE",
		"DEAR",
		"DAMP",
		"WARM",
		"RICH",
		"LONG",
		"DARK",
		"SOFT",
		"BUFF",
		"DOPE",
	]);
	const animal = randomFromArray([
		"BEAR",
		"DOG",
		"CAT",
		"FOX",
		"LAMB",
		"LION",
		"BOAR",
		"GOAT",
		"VOLE",
		"SEAL",
		"PUMA",
		"MULE",
		"BULL",
		"BIRD",
		"BUG",
	]);
	return `${prefix} ${animal}`;
}

function() {

	let playerId;
	let playerRef;

	function initSession() {
		const allPlayersRef = firebase.database().ref(`${sessionId}/players`);

		allPlayersRef.on("value", (snapshot) => {
			//Fires whenever a change occurs

		})

		allPlayersRef.on("child_added", (snapshot) => {
			const addedPlayer = snapshot.val(); // gets playerRef
			//Fires whenever a new node is added the tree
		})

		firebase.auth().inAuthStateChanged((user) => {
			console.log(user)
			if (user) {
				//You're logged in!
				playerId = user.uid;
				playerRef = firebase.database().ref(`players/${playerId}`);

				const name = createName();
				playerRef.set({
					id: playerId,
					name,
					color: randomFromArray(playerColors),
					likes: [],
					dislikes: [],
				})

				playerRef.onDisconnect().remove();

			} else {
				// logged out
			})


		firebase.auth().signInAnonymously()
	} */
const App = observer(
	function AppRender(props: AppRenderProps) {
		function makeRouter() {
			return createHashRouter([
				{
					path: "/",
					element: <Home model={props.model} />,
				},
				{
					path: "/options",
					element: <Options model={props.model} />,
				},
				{
					path: "/swipe",
					element: <Swipe model={props.model}/>,
				},

				{
					path: "/details",
					element: <Details model={props.model} />
				},
				{
					path: "/account",
					element: <Account />
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
