/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: './e2e/jest.environment.js',
  testTimeout: 10e3,
  globals: {
    DOCKER_PID: undefined,
  },
  setupFilesAfterEnv: ['./e2e/jest.setup.ts'],
};
