import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  moduleNameMapper: {
    '^Root/(.*)$': '<rootDir>/src',
    '^@Assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@Data/(.*)$': '<rootDir>/src/data/$1',
    '^@Events/(.*)$': '<rootDir>/src/events/$1',
    '^@Guards/(.*)$': '<rootDir>/src/guards/$1',
    '^@Interceptors/(.*)$': '<rootDir>/src/interceptors/$1',
    '^@Services/(.*)$': '<rootDir>/src/services/$1',
    '^@Types/(.*)$': '<rootDir>/src/types/$1',
    '^@Utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.(t|j)s',
    '!**/types/**',
    '!**/utilities/**',
    '!**/config/**',
    '!**/main.ts',
    '!**/collectors/**',
    '!**/migrations/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
export default config;
