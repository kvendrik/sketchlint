module.exports = {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  automock: false,
  testRegex: '\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
};
