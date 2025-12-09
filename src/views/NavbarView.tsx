import { observer } from "mobx-react-lite";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from "@mui/material";
import "../style.css"

export type navbarViewProps = {
    onLogoClick: () => void;
}

const NavBarView = observer(
	function NavBarRender(props: navbarViewProps) {

		function logoClickACB() {
			props.onLogoClick();
		}

		return (
			<div className="header">
				<h1 onClick={logoClickACB} className="logo-text">
					CineMatch
				</h1>
				<IconButton className="settings-button">
					<SettingsIcon/>	
				</IconButton>
				<IconButton className="profile-button">
					<AccountCircleIcon/>	
				</IconButton>
			</div>
		);
	}
);

export { NavBarView };
