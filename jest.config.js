module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  automock: false,
  testRegex: '\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
};
