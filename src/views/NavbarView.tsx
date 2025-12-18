import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from "@mui/material";
import "../style.css"

export type navbarViewProps = {
	username: string | null;
  onLogoClick: () => void;
	onSignOutClick: () => void;
}


export function NavbarView(props: navbarViewProps) {
	function logoClickACB() {
		props.onLogoClick();
	}

	function signOutClickACB() {
		props.onSignOutClick();
	}

	return (
		<div className="header">
			<h1 onClick={logoClickACB} className="logo-text">
				CineMatch
			</h1>
			{
				props.username ? (
					<>
						<IconButton className="profile-button">
							<p>{props.username}</p>
							<AccountCircleIcon/>	
						</IconButton>
						<button className="secondary-button" onClick={signOutClickACB}>Sign Out</button>
					</>
				):(
					<div>
						<button className="secondary-button" onClick={() => {window.location.hash = "#/account"}}>
							Log In
						</button>
					</div>
				)
			}
		</div>
	);
}
