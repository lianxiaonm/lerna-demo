module.exports = {
  bail: true,
  name: 'packages',
  displayName: 'packages',
  roots: ['<rootDir>'],
  collectCoverage: false,
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: ['node_modules'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  testPathIgnorePatterns: ['node_modules'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules'],
  verbose: true,
  globals: {},
}
