import React from "react";

export const LoginScreen: React.FC = () => {
  return (
    <form>
      <div>
        <label htmlFor="username">User:</label>
        <input type="text" name="username" />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" />
      </div>
      <div>
        <input type="checkbox" name="accept" />
        <label htmlFor="accept">I accept terms and conditions</label>
      </div>
    </form>
  );
};
