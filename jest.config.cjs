// task-manager-frontend/jest.config.cjs
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': 'vue-jest',
  },
  
  transformIgnorePatterns: [
    '/node_modules/(?!axios)',
  ],
};