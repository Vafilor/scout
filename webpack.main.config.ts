import type { Configuration } from 'webpack';
import { join, resolve } from "node:path";
import { WebpackPluginInstance } from "webpack";
import { platform } from "node:os";

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

import CopyPlugin from "copy-webpack-plugin";
import CopyFileWebpackPlugin from "./util/CopyFileWebpackPlugin";

const mainPlugins: WebpackPluginInstance[] = plugins.slice();
if (process.env.APP_MODE === "dev") {
  const extension = platform() === "win32" ? ".exe" : "";
  mainPlugins.push(
    new CopyFileWebpackPlugin({
      sourcePath: join(__dirname, "node_modules", "ffmpeg-static", "ffmpeg" + extension),
      permissions: 0o755
    })
  );
}

mainPlugins.push(new CopyPlugin({
  patterns: [
    {
      from: join(__dirname, "node_modules", "fluent-ffmpeg"),
      to: "fluent-ffmpeg"
    },
  ],
}))

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
  externals: {
    'fluent-ffmpeg': 'fluent-ffmpeg'
  }
};
