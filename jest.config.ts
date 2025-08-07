import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {},
  testMatch: ["**/?(*.)+(spec|test).[t]s?(x)"],
  verbose: true,
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/app/components/$1",
    "^@/stores/(.*)$": "<rootDir>/app/stores/$1",
    "^@/testing/(.*)$": "<rootDir>/app/testing/$1",
    "^@/services/(.*)$": "<rootDir>/app/services/$1",
    "^@/providers/(.*)$": "<rootDir>/app/providers/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/app/testing/setupTests.tsx"],
};

export default createJestConfig(config);
