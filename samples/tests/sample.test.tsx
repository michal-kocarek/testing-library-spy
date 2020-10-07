import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginScreen } from "./components/loginScreen";

describe("foo", () => {
  it("should bar", async () => {
    render(<LoginScreen />);
    // TODO: Make it update already after first render!

    const element = await screen.findByText(/User:/);

    fireEvent.click(await screen.getByRole("checkbox"));

    expect(element).not.toBeNull();
    screen.debug();
  });
});
