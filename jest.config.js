const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  setupFilesAfterEnv: ['<rootDir>/setupJest.ts'],
  collectCoverage: true,
  coverageReporters: ['html', 'text', 'text-summary'],
  coverageDirectory: "./coverage",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/'
  }),
  collectCoverageFrom: [
    "src/modules/**/*.(t|j)s",
    "src/app/**/*.(t|j)s",
  ],
  coveragePathIgnorePatterns: [
    'index.ts',
    '.config.ts',
    '.interfaces.ts',
    '.mock.ts',
    '.models.ts',
    '.module.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 75,
      lines: 75,
      statements: 80
    }
  }
};