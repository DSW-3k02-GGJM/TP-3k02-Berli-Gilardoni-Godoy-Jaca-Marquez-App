/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  resolver: 'jest-ts-webcompat-resolver',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'es2022',
          module: 'es2022',
          moduleResolution: 'bundler',
        },
        useESM: true,
        compiler: 'typescript',
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
};
