import { observer } from "mobx-react-lite";
import { AccountView } from "../views/accountView";
import { signInWithEmail, signUpWithEmail } from "../authService";

const Account = observer(
  function AccountRender() {
    async function handleLoginACB(email: string, password: string) {
      try {
        await signInWithEmail(email.trim(), password);
        window.location.hash = "#/";
      } catch (err: any) {
        alert(err?.message ?? "Login failed");
      }
    }

    async function handleSignupACB(email: string, password: string) {
      try {
        await signUpWithEmail(email.trim(), password);
        window.location.hash = "#/";
      } catch (err: any) {
        alert(err?.message ?? "Signup failed");
      }
    }

    return (
      <AccountView onLogin={handleLoginACB} onSignup={handleSignupACB}/>
    );
  }
);

export { Account };