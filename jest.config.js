/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: './e2e/jest.environment.js',
  testTimeout: 60 * 1000,
  globals: {
    DOCKER_PID: undefined,
  },
};
