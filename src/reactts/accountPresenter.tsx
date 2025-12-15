import { observer } from "mobx-react-lite";
import { LoginView } from "../views/loginView";
import { SignupView } from "../views/signupView";
import { signInWithEmail, signUpWithEmail } from "../authService";
import { useState } from "react";
import { addUsernameToProfile } from "../firestoreModel";

const Account = observer(
  function AccountRender() {
    const [showLogin, setShowLogin] = useState(true);

    async function handleLoginACB(email: string, password: string) {
      try {
        await signInWithEmail(email.trim(), password);
        window.location.hash = "#/";
      } catch (err: any) {
        alert(err?.message ?? "Login failed");
      }
    }

    async function handleSignupACB(username: string, email: string, password: string) {
      try {
        // Create the user account and then add the username to the profile
        await signUpWithEmail(username.trim(), email.trim(), password);
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