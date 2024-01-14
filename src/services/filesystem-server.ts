import FilesRepository, { ListFileOptions } from "app/db/files-repository";
import { File as DatabaseFile, FileState, FileType } from "app/db/schema/files";
import { AppFile } from "app/types/filesystem";
import { dirname } from "node:path";
import { opendir, stat } from "node:fs/promises";
import { Dirent, Stats } from "node:fs";

interface PartitionFileItem {
    dirent: Dirent;
    stats: Stats;
}

function fileStatsToFileType(stats: Stats): FileType {
    if (stats.isFile()) {
        return FileType.File;
    }

    if (stats.isDirectory()) {
        return FileType.Directory;
    }

    throw new Error(`FileType not supported: mode -> ${stats.mode}`);
}


function databaseFileToAppFile(databaseFile: DatabaseFile): AppFile {
    return {
        name: databaseFile.name,
        path: databaseFile.path,
        size: databaseFile.size ? databaseFile.size : undefined,
        isFile: databaseFile.type === FileType.File
    };
}

function partitionFileItemToDatabaseFile({ stats, dirent }: PartitionFileItem): Omit<DatabaseFile, "id"> {
    return {
        name: dirent.name,
        canonicalName: dirent.name.toLocaleLowerCase(),
        path: dirent.path,
        parentPath: dirname(dirent.path),
        createdAt: Date.now(),
        type: fileStatsToFileType(stats),
        size: stats.size,
        lastAccessTimeMs: stats.atimeMs,
        lastModifiedTimeMs: stats.mtimeMs,
        lastFileStatusChangeTimeMs: stats.ctimeMs,
        createdAtTimeMs: stats.birthtimeMs,
        state: null,
    };
}

export default class FilesystemServer {
    static readonly PARTITION_SIZE = 1000;

    constructor(private filesRepo: FilesRepository) {
    }

    protected async *_listDirectoryInPartitions(path: string, partitionSize: number) {
        let files = [];

        const dir = await opendir(path);
        for await (const dirent of dir) {
            const stats = await stat(dirent.path);
            files.push({
                dirent,
                stats
            });

            if (files.length === partitionSize) {
                yield files;
                files = [];
            }
        }

        if (files.length !== 0) {
            yield files;
        }
    }

    protected async *listDirectoryInPartitions(path: string, partitionSize: number) {
        if (partitionSize < 1) {
            throw new Error("Partition size must be > 0");
        }

        yield* this._listDirectoryInPartitions(path, partitionSize);
    }

    async processDirectory(path: string) {
        await this.filesRepo.updateStateForParentPath(path, FileState.ToBeDeleted);

        let pendingDatabaseOperations: Promise<void>[] = [];

        for await (const partition of this.listDirectoryInPartitions(path, FilesystemServer.PARTITION_SIZE)) {
            await Promise.all(pendingDatabaseOperations);
            pendingDatabaseOperations = [];

            const databaseFiles = await this.filesRepo.findForPaths(
                partition.map(p => p.dirent.path)
            );

            const pathToDatabaseFile = new Map<string, DatabaseFile>();
            for (const databaseFile of databaseFiles) {
                pathToDatabaseFile.set(databaseFile.path, databaseFile);
            }

            for (const partitionFile of partition) {
                const filePath = partitionFile.dirent.path;
                const existingDatabaseFile = pathToDatabaseFile.get(filePath);

                // Create new database file record
                if (!existingDatabaseFile) {
                    pendingDatabaseOperations.push(
                        this.filesRepo.insert(partitionFileItemToDatabaseFile(partitionFile))
                    );
                } else if (existingDatabaseFile) {
                    if (existingDatabaseFile.lastModifiedTimeMs === partitionFile.stats.mtimeMs) {
                        pendingDatabaseOperations.push(
                            this.filesRepo.updateStateForPath(filePath, null)
                        );
                    } else {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { path, ...data } = partitionFileItemToDatabaseFile(partitionFile);
                        pendingDatabaseOperations.push(
                            this.filesRepo.updateForPath(filePath, data)
                        );
                    }
                }
            }
        }

        await this.filesRepo.deleteToBeDeletedForParentPath(path);
    }

    async listDirectory(path: string, options?: ListFileOptions): Promise<AppFile[]> {
        return (await this.filesRepo.findForParentPath(path, options)).map(databaseFileToAppFile);
    }
}