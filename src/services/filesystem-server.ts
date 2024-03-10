import { AppFile } from "app/types/filesystem";
import { opendir, stat } from "node:fs/promises";
import { fileStatToType } from "./utils";

export default class FilesystemServer {
    async listDirectory(path: string): Promise<AppFile[]> {
        const files: AppFile[] = [];

        const dir = await opendir(path);
        for await (const dirent of dir) {
            // TODO if you can't stat this, push an error into the listing
            const stats = await stat(dirent.path);
            files.push({
                name: dirent.name,
                path: dirent.path,
                size: stats.size,
                type: fileStatToType(stats)
            });
        }

        return files;
    }
}