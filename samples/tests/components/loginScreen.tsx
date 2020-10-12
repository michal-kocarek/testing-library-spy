import React, { FormEventHandler, useState } from "react";

export const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setIsError] = useState("");

  // This is very fake error handler, that simulates asynchronous action and few
  // changes in the DOM tree itself...
  const submitForm: FormEventHandler = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsError("Login failed. Wrong credentials were supplied.");
      setIsLoading(false);
    }, 5000);
  };

  return (
    <form onSubmit={submitForm}>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div>
        <label htmlFor="username">User:</label>
        <input type="text" name="username" id="username" />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" id="password" />
      </div>
      <div>
        <input type="checkbox" name="accept" id="accept" />
        <label htmlFor="accept">I accept terms and conditions</label>
      </div>
      <div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
};
