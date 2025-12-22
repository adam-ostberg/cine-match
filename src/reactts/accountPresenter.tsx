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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleLoginACB(email: string, password: string) {
      try {
        await signInWithEmail(props.userModel, email.trim(), password);
        window.location.hash = "#/";
      } catch (err: any) {
        switch (err?.message) {
          case "Firebase: Error (auth/invalid-credential).":
            setErrorMessage("Incorrect password or email");
            break;
          case "Firebase: Error (auth/invalid-email).":
            setErrorMessage("Invalid email.");
            break;
          case "Firebase: Error (auth/missing-password).":
            setErrorMessage("Password is required.");
            break;
          default:
            setErrorMessage(err?.message ?? "Login failed");
        }
      }
    }

    async function handleSignupACB(username: string, email: string, password: string) {
      try {
        // Create the user account and then add the username to the profile
        await signUpWithEmail(props.userModel, username.trim(), email.trim(), password);
        window.location.hash = "#/";
      } catch (err: any) {
        switch (err?.message) {
          case "Firebase: Error (auth/invalid-credential).":
            setErrorMessage("Incorrect password or email");
            break;
          case "Firebase: Error (auth/invalid-email).":
            setErrorMessage("Invalid email.");
            break;
          case "Firebase: Error (auth/missing-password).":
            setErrorMessage("Password is required.");
            break;
          default:
            setErrorMessage(err?.message ?? "Login failed");
        }
      }
    }

    return (
      showLogin ?
      <LoginView 
        onLogin={handleLoginACB}
        onToCreateAccount={() => setShowLogin(false)}
        errorMessage={errorMessage}
      /> :
      <SignupView 
        onSignup={handleSignupACB}
        onToLogin={() => setShowLogin(true)}
        errorMessage={errorMessage}
      />
    );
  }
);

export { Account };