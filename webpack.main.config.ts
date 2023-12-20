import type { Configuration } from 'webpack';
import { resolve } from "node:path";


import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: {
    index: './src/index.ts',
    "worker-pool": './src/workers/worker_pool.ts',
    worker: './src/workers/worker.ts'
  },
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      app: resolve(__dirname, "src/")
    }
  },
  output: {
    filename: '[name].js'
  }
};
