module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 1*60*1000,
  setupFiles: ["dotenv/config"],
  expand: true,
  verbose: true,
  reporters: ['default'],
  collectCoverage: true,
  rootDir: '../',
  coverageDirectory: './test/coverage',
  testPathIgnorePatterns: ['/node_modules/']
};
