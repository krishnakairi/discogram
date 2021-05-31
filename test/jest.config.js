module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["dotenv/config"],
  expand: true,
  verbose: true,
  reporters: ['default'],
  collectCoverage: true,
  rootDir: '../',
  coverageDirectory: './test/coverage',
  testPathIgnorePatterns: ['/node_modules/']
};
