import { observer } from "mobx-react-lite";
import { UserModel } from "../UserModel"
import { NavbarView } from "../views/NavbarView";
import { signOutUser } from "../authService";
import type { SessionModel } from "../SessionModel";

type NavbarPresenterProps = {
  userModel: UserModel;
  sessionModel: SessionModel;
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
      props.sessionModel.clearMatchVars();
      props.sessionModel.setSessionId(null);
      props.userModel.setCurrentSessionId(null);
      window.location.hash = "#/";
    }

    const user = props.userModel;
    const username = (user.currentUser && user.username) || null;

    return (
      <NavbarView 
        onLogoClick={logoClickACB} 
        onSignOutClick={handleSignOutACB} 
        onExitSession={handleExitSessionACB} 
        username={username} 
        userId={user.userId || ""} 
        sessionId={props.sessionModel.sessionId}
      />
    );
  }
);

export { Navbar };