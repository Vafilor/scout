import { validate } from "schema-utils";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { chmodSync } from "node:fs";

const pluginName = 'CopyFileWebpackPlugin';

// schema for options object
const schema = {
    type: 'object',
    properties: {
        sourcePath: {
            type: 'string',
        },
        permissions: {
            type: 'number'
        }
    },
};

export default class CopyFileWebpackPlugin {
    constructor(options = {}) {
        validate(schema, options, {
            name: pluginName,
            baseDataPath: 'options',
        });

        this.sourcePath = options.sourcePath;
        this.permissions = options.permissions;
    }

    apply(compiler) {
        const { RawSource } = compiler.webpack.sources;
        const fileName = basename(this.sourcePath);

        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
            compilation.hooks.processAssets.tapAsync({
                name: pluginName,
                stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
            },
                async (unusedAssets, callback) => {
                    try {
                        const source = new RawSource(await readFile(this.sourcePath));
                        compilation.emitAsset(fileName, source);
                    } catch (err) {
                        callback(err);
                        return;
                    }

                    callback();
                }
            )

            compiler.hooks.assetEmitted.tap(pluginName, (file, { targetPath }) => {
                if (file === fileName) {
                    chmodSync(targetPath, this.permissions);
                }
            });
        });
    }
}
