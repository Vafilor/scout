import { parentPort } from "node:worker_threads";
import { TaskAction, WorkerTask } from "./types";

import { readFile } from "node:fs/promises";
import decode from 'heic-decode';
import { createIcon } from "app/server/image";

function main() {
    if (parentPort === null) {
        return;
    }

    const parent = parentPort;
    parent.on('message', async (task: WorkerTask) => {
        if (task.type === TaskAction.CreateIcon) {
            await createIcon(task);

            parent.postMessage(task.inputPath);
        } else if (task.type === TaskAction.LoadHeicData) {
            const inputBuffer = await readFile(task.path);
            const result = await decode({ buffer: inputBuffer });

            parent.postMessage(result);
        }
    });
}

main();