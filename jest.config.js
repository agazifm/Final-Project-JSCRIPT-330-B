module.exports = {
    testEnvironment: 'node',
    setupFiles: ['./jest.setup.js'],

            // ... other configurations ...
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    moduleNameMapper: {
    '^node:': 'jest-mock',
    },
    transformIgnorePatterns: ['/node_modules/(?!@mongoose)'],
  };
  