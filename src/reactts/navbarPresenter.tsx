import { observer } from "mobx-react-lite";
import { type UserModelType } from "../UserModel"
import { NavbarView } from "../views/NavbarView";
import { signOutUser } from "../authService";

type NavbarPresenterProps = {
  userModel: UserModelType;
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

    const user = props.userModel;
    const username = (user.currentUser && user.username) || null;

    return (
      <NavbarView onLogoClick={logoClickACB} onSignOutClick={handleSignOutACB} username={username} userId={user.userId || ""} />
    );
  }
);

export { Navbar };