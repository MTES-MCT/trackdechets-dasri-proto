module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/dist/"],
  testMatch: ["**/__tests__/**/?(*.)+(spec|test|integration).[jt]s?(x)"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^integration-tests/(.*)$": "<rootDir>/integration-tests/$1"
  }
};
