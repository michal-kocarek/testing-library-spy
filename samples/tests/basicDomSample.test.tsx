import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginScreen } from "./components/loginScreen";

describe("Component with static fields", () => {
  it("should render correctly", async () => {
    render(<LoginScreen />);

    const element = await screen.findByText(/User:/);

    screen.debug();

    expect(element).not.toBeNull();
  });
});
