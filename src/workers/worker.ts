import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { CreateIconTask, TaskAction, WorkerTask } from "./types";

import { extname } from "node:path";
import sharp from "sharp";

import { readFile } from "node:fs/promises";
// TODO types
import decode from 'heic-decode';
import { Task } from "electron";

async function createIcon(inputPath: string, outputPath: string, width: number, height: number): Promise<void> {
    const ext = extname(inputPath).toLowerCase();

    if (ext === ".heic") {
        const inputBuffer = await readFile(inputPath);
        const { data, width: imageWidth, height: imageHeight } = await decode({ buffer: inputBuffer });

        // TODO 4 is a guess - need to validate
        await sharp(data, { raw: { width: imageWidth, height: imageHeight, channels: 4 } }).resize(width, height).jpeg().toFile(outputPath);
    } else {
        await sharp(inputPath).resize(width, height).jpeg().toFile(outputPath);
    }
}

function main() {
    if (parentPort === null) {
        return;
    }

    const parent = parentPort;
    parent.on('message', async (task: WorkerTask) => {
        if (task.type === TaskAction.CreateIcon) {
            await createIcon(task.inputPath, task.outputPath, task.width, task.height);

            parent.postMessage(task.inputPath);
        } else if (task.type === TaskAction.LoadHeicData) {
            const inputBuffer = await readFile(task.path);
            const result = await decode({ buffer: inputBuffer });

            parent.postMessage(result);
        }
    });
}

main();