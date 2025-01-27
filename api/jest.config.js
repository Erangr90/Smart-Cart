export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(babel-jest)/)"
  ],
  setupFilesAfterEnv: ['./test-setup.js'],
};
