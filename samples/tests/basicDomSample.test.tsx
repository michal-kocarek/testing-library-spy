import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginScreen } from "./components/loginScreen";

describe("Component with static fields", () => {
  it("should render correctly", async () => {
    render(<LoginScreen />);

    const user = await screen.findByLabelText(/User:/);
    await userEvent.type(user, "john.doe");

    const password = await screen.findByLabelText(/Password:/);
    await userEvent.type(password, "123456");

    const checkbox = await screen.findByLabelText(
      /I accept terms and conditions/
    );
    userEvent.click(checkbox);

    const submitButton = await screen.findByText(/Login/);
    userEvent.click(submitButton);

    await screen.findByText(/Login failed./);

    screen.debug();
  }, 50_000);
});
