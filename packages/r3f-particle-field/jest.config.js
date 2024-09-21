/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
};
