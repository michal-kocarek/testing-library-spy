import { configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import { initPlayground } from "../../server/dist/toolkit";

initPlayground();

configure({ asyncUtilTimeout: 40_000 });
