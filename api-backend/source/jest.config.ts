import type {Config} from 'jest';

const config: Config = {
    verbose: true,
    moduleDirectories: ['node_modules', 'source'],
    testMatch: ['<rootDir>/source/**/*.test.ts']
  };

export default config;