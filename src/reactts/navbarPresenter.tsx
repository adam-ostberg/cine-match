import { observer } from "mobx-react-lite";
import { type UserModelType } from "../UserModel"
import { NavbarView } from "../views/NavbarView";
import { signOutUser } from "../authService";
import type { SessionType } from "../SessionModel";

type NavbarPresenterProps = {
  userModel: UserModelType;
  sessionModel: SessionType;
}

const Navbar = observer(
  function NavbarRender(props: NavbarPresenterProps) {

    function logoClickACB() {
      // Set the router location to home
      window.location.hash = "#/";
    }

    function handleSignOutACB() {
      signOutUser().then(() => {
        window.location.hash = "#/";
      });
    }

    function handleExitSessionACB() {
      const userId = props.userModel.userId;
      if (userId) {
        props.sessionModel.removeUser(userId);
      }
      props.sessionModel.setSessionId(null);
      props.userModel.setCurrentSessionId(null);
      window.location.hash = "#/";
    }

    const user = props.userModel;
    const username = (user.currentUser && user.username) || null;

    return (
      <NavbarView onLogoClick={logoClickACB} onSignOutClick={handleSignOutACB} onExitSession={handleExitSessionACB} username={username} userId={user.userId || ""} sessionStatus={props.sessionModel.status}/>
    );
  }
);

export { Navbar };