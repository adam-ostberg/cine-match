import "/src/style.css";

type SignupViewProps = {
    onSignup: (username: string, email: string, password: string) => void;
    onToLogin: () => void;
};

export function SignupView({onSignup, onToLogin}: SignupViewProps) {
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
    onSignup(signupValues.username, signupValues.email, signupValues.password);
  }

  function handleSwitchToLoginACB() {
    onToLogin();
  }

  return (
    <div className="account-section">
        <div className="account-form">
          <h1>Create an account!</h1>
          <label>
            Username:
            <input id="username" type="text" placeholder="Username" required />
          </label>
          <label>
            E-Mail:
            <input id="email" type="email" placeholder="example@address.com" required />
          </label>
          <label>
            Password:
            <input id="password" type="password" placeholder="password" required />
          </label>
          <div className="button-row">
            <button className="secondary-button" onClick={signUpACB}>Sign Up</button>
          </div>
        </div>
        <p>or</p>
        <a href="#/account" onClick={handleSwitchToLoginACB}>Login to existing account</a>
      </div>
  );
}
