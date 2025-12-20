import "/src/style.css";

type LoginViewProps = {
    errorMessage: string | null;
    onLogin: (email: string, password: string) => void;
    onToCreateAccount: () => void;
};

export function LoginView(props: LoginViewProps) {
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
    props.onLogin(loginValues.email, loginValues.password);
  }

  function switchToCreateAccountACB() {
    props.onToCreateAccount();
  }

  return (
    <div className="account-section">
        <div className="account-form">
          <h1>Login</h1>
          {props.errorMessage && <p className="error-message">{props.errorMessage}</p>}
          <label>
            E-Mail:
          </label>
          <input id="email" type="email" placeholder="example@address.com" required />
          <label>
            Password:
          </label>
          <input id="password" type="password" placeholder="password" required />
          <div className="button-row">
            <button className="primary-button" onClick={loginACB}>Login</button>
          </div>
        </div>
        <p>or</p>
        <a href="#/account" onClick={switchToCreateAccountACB}>Create account</a>
      </div>
  );
}
