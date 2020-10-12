import React from "react";
import { render, screen } from "@testing-library/react";

import { Clock } from "./components/clock";

describe("DOM mutating component", () => {
  it("should update time every 1 second", async () => {
    render(<Clock />);

    // Enough time to watch inside Spy console what is happening
    await screen.findByText(/foo/, undefined, { timeout: 40_000 });
    screen.debug();
  }, 50_000);
});
