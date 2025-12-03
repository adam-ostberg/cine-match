import { observer } from "mobx-react-lite";
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
				<div className="settingsIcon">
					<img src="src/assets/settings_icon.png" alt="" />
				</div>
				<div className="profile">
					<img src="src/assets/user_profile.png" alt="" />
				</div>
			</div>
		);
	}
);

export { NavBarView };
