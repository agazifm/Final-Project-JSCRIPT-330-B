module.exports = {
    testEnvironment: 'node',
    setupFiles: ['./jest.setup.js'],
    testTimeout: 30000, // Increase the timeout to 30 seconds

            // ... other configurations ...
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    moduleNameMapper: {
    '^node:': 'jest-mock',
    },
    transformIgnorePatterns: ['/node_modules/(?!@mongoose)'],
  };
  