// import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from "@mui/material";
import { FaUserCircle } from "react-icons/fa";
import "../style.css"
import { UserAvatar } from "../components/UserAvatar.tsx";

export type navbarViewProps = {
	username: string | null;
	userId: string;
	sessionStatus: string;
	onLogoClick: () => void;
	onSignOutClick: () => void;
	onExitSession: () => void;
}


export function NavbarView(props: navbarViewProps) {
	function logoClickACB() {
		props.onLogoClick();
	}

	function signOutClickACB() {
		props.onSignOutClick();
	}

	function exitSessionACB() {
		props.onExitSession();
	}

	const sessionActive = props.sessionStatus === "active" || props.sessionStatus === "matched";

	function profileClickACB() {
		window.location.hash = "#/profile";
	}

	return (
		<div className="header">
			<h1 onClick={logoClickACB} className="logo-text">
				CineMatch
			</h1>
			{sessionActive ?
				<button className="secondary-button" onClick={exitSessionACB}>
					Exit Session
				</button>
				: ""
			}
			{
				props.username ? (
					<>
						<IconButton className="profile-button" onClick={profileClickACB}>
							<p className="username">{props.username}</p>
							{props.userId ? <UserAvatar
								userId={props.userId}
								className="profile-pic navbar"
								size={60}
							/>
								:
								<FaUserCircle size={60} className="profile-pic placeholder" />}

						</IconButton>
						<button className="secondary-button" onClick={signOutClickACB}>Sign Out</button>
					</>
				) : (
					<div>
						<button className="secondary-button" onClick={() => { window.location.hash = "#/account" }}>
							Log In
						</button>
					</div>
				)
			}
		</div>
	);
}
