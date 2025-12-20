import { observer } from "mobx-react-lite";
import { LoginView } from "../views/loginView";
import { SignupView } from "../views/signupView";
import { signInWithEmail, signUpWithEmail } from "../authService";
import { useState } from "react";
import type { MovieModel } from "../MovieModel";
import type { UserModel } from "../UserModel";

type AccountPresenterProps = {
  model: MovieModel;
  userModel: UserModel;
}

const Account = observer(
  function AccountRender(props: AccountPresenterProps) {
    const [showLogin, setShowLogin] = useState(true);

    async function handleLoginACB(email: string, password: string) {
      try {
        await signInWithEmail(props.userModel, email.trim(), password);
        window.location.hash = "#/";
      } catch (err: any) {
        alert(err?.message ?? "Login failed");
      }
    }

    async function handleSignupACB(username: string, email: string, password: string) {
      try {
        // Create the user account and then add the username to the profile
        await signUpWithEmail(props.userModel, username.trim(), email.trim(), password);
        window.location.hash = "#/";
      } catch (err: any) {
        alert(err?.message ?? "Signup failed");
      }
    }

    return (
      showLogin ?
      <LoginView 
        onLogin={handleLoginACB}
        onToCreateAccount={() => setShowLogin(false)}
      /> :
      <SignupView 
        onSignup={handleSignupACB}
        onToLogin={() => setShowLogin(true)}
      />
    );
  }
);

export { Account };