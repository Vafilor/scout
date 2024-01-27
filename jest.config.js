/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/src/$1', // This should match what's in tsconfig.json
  },
};