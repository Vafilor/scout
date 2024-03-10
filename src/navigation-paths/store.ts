import { IpcMainEvent } from "electron";
import { writeFile, readFile } from "node:fs/promises";
import { NavigationPath } from "./types";

export default class Store {
    private _paths: NavigationPath[] = [];

    constructor(private path: string) {
    }

    async get(event: IpcMainEvent): Promise<NavigationPath[]> {
        try {
            const content = await readFile(this.path, { encoding: "utf8" });
            // TODO some validation would be nice. 
            // e.g. Are there keys that we don't use?
            // Is the data in the correct format/type?
            this._paths = JSON.parse(content) as NavigationPath[];
        } catch (err) {
            this._paths = [];
            await this.flush();
        }

        return this._paths.slice();
    }

    async update(event: IpcMainEvent, paths: NavigationPath[]): Promise<void> {
        this._paths = paths;

        await this.flush();
    }

    private async flush() {
        try {
            await writeFile(this.path, JSON.stringify(this._paths));
        } catch (err) {
            console.error(err);
        }
    }
}