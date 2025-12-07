import "/src/style.css";

type AccountViewProps = {
    onLogin: (email: string, password: string) => void;
    onSignup: (email: string, password: string) => void;
};

export function AccountView({onLogin, onSignup}: AccountViewProps) {
  // Gets and returns the current values of the email and password input fields
  function getValues() {
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;

    return {
      email: emailInput.value,
      password: passwordInput.value
    }
  }
  
  function loginACB() {
    const loginValues = getValues();
    onLogin(loginValues.email, loginValues.password);
  }

  function signUpACB() {
    const signupValues = getValues();
    onSignup(signupValues.email, signupValues.password);
  }

  return (
    <div className="account-section">
        <div className="account-form">
          <h1>Login or Sign Up</h1>
          <label>
            E-Mail:
            <input id="email" type="email" placeholder="example@address.com" required />
          </label>
          <label>
            Password:
            <input id="password" type="password" placeholder="password" required />
          </label>
          <div className="button-row">
            <button className="primary-button" onClick={loginACB}>Login</button>
            <button className="secondary-button" onClick={signUpACB}>Sign Up</button>
          </div>
        </div>
      </div>
  );
}
