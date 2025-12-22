import "/src/style.css";
import type { KeyboardEvent } from "react";

type SignupViewProps = {
    errorMessage: string | null;
    onSignup: (username: string, email: string, password: string) => void;
    onToLogin: () => void;
};

export function SignupView(props: SignupViewProps) {
  // Gets and returns the current values of the email and password input fields
  function getValues() {
    const usernameInput = document.getElementById("username") as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;

    return {
      username: usernameInput.value,
      email: emailInput.value,
      password: passwordInput.value
    }
  }

  function signUpACB() {
    const signupValues = getValues();
    props.onSignup(signupValues.username, signupValues.email, signupValues.password);
  }

  function handleKeyDownACB(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      signUpACB();
    }
  }

  function handleSwitchToLoginACB() {
    props.onToLogin();
  }

  return (
    <div className="account-section">
        <div className="account-form">
          <h1>Create an account!</h1>
          {props.errorMessage && <p className="error-message">{props.errorMessage}</p>}
          <label>
            Username:
          </label>
          <input id="username" type="text" placeholder="Username" required onKeyDown={handleKeyDownACB} />
          <label>
            E-Mail:
          </label>
          <input id="email" type="email" placeholder="example@address.com" required onKeyDown={handleKeyDownACB} />
          <label>
            Password:
          </label>
          <input id="password" type="password" placeholder="password" required onKeyDown={handleKeyDownACB} />
          <div className="button-row">
            <button className="primary-button" onClick={signUpACB}>Sign Up</button>
          </div>
        </div>
        <p>or</p>
        <a href="#/account" onClick={handleSwitchToLoginACB}>Login to existing account</a>
      </div>
  );
}
