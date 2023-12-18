import { IpcMainEvent } from "electron";
import { writeFile, readFile } from "node:fs/promises";

export interface ConfigurationOptions {
    showHiddenFiles: boolean;
}

function createDefaultConfiguration(): ConfigurationOptions {
    return {
        showHiddenFiles: false,
    };
}

export default class Store {
    private _options: ConfigurationOptions;

    constructor(private path: string) {
    }

    async getOptions(event: IpcMainEvent): Promise<ConfigurationOptions> {
        try {
            const content = await readFile(this.path, { encoding: "utf8" });
            // TODO some validation would be nice. 
            // e.g. Are there keys that we don't use?
            // Is the data in the correct format/type?
            this._options = JSON.parse(content) as ConfigurationOptions;
        } catch (err) {
            this._options = createDefaultConfiguration();
            await this.flush();
        }

        return { ...this._options };
    }

    async update(event: IpcMainEvent, options: Partial<ConfigurationOptions>): Promise<void> {
        this._options = {
            ...this._options,
            ...options
        };

        await this.flush();
    }

    private async flush() {
        try {
            await writeFile(this.path, JSON.stringify(this._options));
        } catch (err) {
            console.error(err);
        }
    }
}