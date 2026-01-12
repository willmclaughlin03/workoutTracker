export default {
  testEnvironment: 'jsdom',
  
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  moduleFileExtensions: ['js', 'jsx'],
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Remove the incorrect moduleNameMapper or leave it empty
  moduleNameMapper: {},
  
  // This helps Jest find manual mocks
  moduleDirectories: ['node_modules', 'src']
};