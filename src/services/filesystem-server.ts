import { AppFile } from "app/types/filesystem";
import { opendir, stat } from "node:fs/promises";

export default class FilesystemServer {
    async listDirectory(path: string): Promise<AppFile[]> {
        const files: AppFile[] = [];

        const dir = await opendir(path);
        for await (const dirent of dir) {
            const stats = await stat(dirent.path);
            files.push({
                name: dirent.name,
                path: dirent.path,
                size: stats.size,
                isFile: dirent.isFile()
            });
        }

        return files;
    }
}