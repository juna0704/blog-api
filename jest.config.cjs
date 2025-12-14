/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  // Only setup for integration/e2e tests, NOT unit tests
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^jsdom$': '<rootDir>/tests/mocks/jsdom.js',
    '^dompurify$': '<rootDir>/tests/mocks/dompurify.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!(parse5)/)'],
  testTimeout: 60000,
};
