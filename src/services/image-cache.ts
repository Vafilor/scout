import ImageCacheRepository from "app/db/image-cache-repository";
import { resolve } from "node:path";
import { stat, mkdir, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import WorkerPool from "app/workers/worker-pool";
import { fileExists } from "app/server/filesystem";
import { TaskAction } from "app/workers/types";
import { NodeJSErrorCode, isNodeJsError } from "app/utils/error";
import sleep from "app/utils/sleep";

export default class ImageCache {
    private pendingKeys = new Set<string>();
    private sleepDurationMs = 2;

    constructor(
        private cachePath: string,
        private imageCacheRepository: ImageCacheRepository,
        private workerPool: WorkerPool) {
    }

    async initialize(): Promise<void> {
        if (!await fileExists(this.cachePath)) {
            await mkdir(this.cachePath)
        }
    }

    private keyPath(path: string, width: number, height: number): string {
        return `${path}_${width}x${height}`;
    }

    set sleepDuration(ms: number) {
        if (ms < 0) {
            throw new Error(`Sleep duration must be >= 0. '${ms}' passed in.`);
        }

        this.sleepDurationMs = ms;
    }

    async getOrCreate(path: string, width: number, height: number): Promise<string> {
        const key = this.keyPath(path, width, height);

        while (this.pendingKeys.has(key)) {
            await sleep(this.sleepDurationMs);
        }

        this.pendingKeys.add(key);

        const [stats, dbRecord] = await Promise.all([stat(path), this.imageCacheRepository.findForKey(key)]);

        if (dbRecord !== null && Math.floor(dbRecord.lastModifiedTimeMs) === Math.floor(stats.mtimeMs)) {
            if (await fileExists(dbRecord.cachePath)) {
                this.pendingKeys.delete(key);
                return dbRecord.cachePath;
            }
        }

        if (dbRecord !== null) {
            try {
                await unlink(path);
            } catch (err: unknown) {
                // Only throw error if it is not file does not exist
                if (!isNodeJsError(err) || err.code !== NodeJSErrorCode.ENOENT) {
                    this.pendingKeys.delete(key);
                    throw err;
                }
            }
        }

        const outputName = randomUUID() + ".jpg"
        const cachedFilePath = resolve(this.cachePath, outputName);

        try {
            await this.workerPool.runTaskPromise({
                type: TaskAction.CreateIcon,
                inputPath: path,
                outputPath: cachedFilePath,
                width,
                height
            });
        } catch (err: unknown) {
            this.pendingKeys.delete(key);
            throw err;
        }

        if (dbRecord === null) {
            await this.imageCacheRepository.insert({
                key,
                lastModifiedTimeMs: stats.mtimeMs,
                cachePath: cachedFilePath
            });
        } else {
            await this.imageCacheRepository.updateForKey(key, {
                lastModifiedTimeMs: stats.mtimeMs,
                cachePath: cachedFilePath
            });
        }

        this.pendingKeys.delete(key);

        return cachedFilePath;
    }
}