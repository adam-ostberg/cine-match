import "/src/style.css";

type LoginViewProps = {
    onLogin: (email: string, password: string) => void;
    onToCreateAccount: () => void;
};

export function LoginView({onLogin, onToCreateAccount}: LoginViewProps) {
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

  function switchToCreateAccountACB() {
    onToCreateAccount();
  }

  return (
    <div className="account-section">
        <div className="account-form">
          <h1>Login</h1>
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
          </div>
        </div>
        <p>or</p>
        <a href="#/account" onClick={switchToCreateAccountACB}>Create account</a>
      </div>
  );
}
