import type { Configuration } from 'webpack';
import { join, resolve } from "node:path";
import { WebpackPluginInstance } from "webpack";

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

import CopyFileWebpackPlugin from "./util/CopyFileWebpackPlugin";

const mainPlugins: WebpackPluginInstance[] = plugins.slice();
if (process.env.APP_MODE === "dev") {
  // TODO ffmpeg binary name might vary based on OS - need to test.
  mainPlugins.push(
    new CopyFileWebpackPlugin({
      sourcePath: join(__dirname, "node_modules", "ffmpeg-static", "ffmpeg"),
      permissions: 0o755
    })
  );
}

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: {
    index: './src/index.ts',
    "worker-pool": './src/workers/worker-pool.ts',
    worker: './src/workers/worker.ts'
  },
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: mainPlugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      app: resolve(__dirname, "src/")
    }
  },
  output: {
    filename: '[name].js'
  },
};
