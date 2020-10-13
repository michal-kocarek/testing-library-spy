import { configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import { initSpyConsole } from "../../server/dist/toolkit";

initSpyConsole();

configure({ asyncUtilTimeout: 40_000 });
