import { AsyncResource } from 'node:async_hooks';
import { EventEmitter } from 'node:events';
import { resolve } from 'node:path';
import { Worker } from 'node:worker_threads';
import { WorkerTask } from './types';

export type TaskInfoCallback = (err: Error | null, result: unknown) => void;

class WorkerPoolTaskInfo extends AsyncResource {
    constructor(private callback: TaskInfoCallback) {
        super('WorkerPoolTaskInfo');
    }

    done(err: Error | null, result: unknown) {
        this.runInAsyncScope(this.callback, null, err, result);
        this.emitDestroy();  // `TaskInfo`s are used only once.
    }
}

interface WorkerPoolTask {
    task: WorkerTask;
    callback: TaskInfoCallback;
}

export default class WorkerPool extends EventEmitter {
    static readonly kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

    private workers: Worker[] = [];
    private freeWorkers: Worker[] = [];
    private tasks: WorkerPoolTask[] = [];
    private workerTasks = new Map<Worker, WorkerPoolTaskInfo>();

    constructor(numThreads: number) {
        super();

        for (let i = 0; i < numThreads; i++) {
            this.addNewWorker();
        }

        // Any time the kWorkerFreedEvent is emitted, dispatch
        // the next task pending in the queue, if any.
        this.on(WorkerPool.kWorkerFreedEvent, () => {
            if (this.tasks.length > 0) {
                const nextTask = this.tasks.shift();
                if (nextTask) {
                    this.runTask(nextTask.task, nextTask.callback);
                }
            }
        });
    }

    addNewWorker() {
        // TODO is there a nicer way to get this dependency instead of knowing it eventually becomes .js?
        const worker = new Worker(resolve(__dirname, 'worker.js'));
        worker.on('message', (result) => {
            // In case of success: Call the callback that was passed to `runTask`,
            // remove the `TaskInfo` associated with the Worker, and mark it as free
            // again.

            const taskInfo = this.workerTasks.get(worker);
            if (!taskInfo) {
                this.emit('error', new Error("Task info not found for worker"));
                return;
            }

            taskInfo.done(null, result);
            this.workerTasks.delete(worker);

            this.freeWorkers.push(worker);
            this.emit(WorkerPool.kWorkerFreedEvent);
        });

        worker.on('error', (err) => {
            // In case of an uncaught exception: Call the callback that was passed to
            // `runTask` with the error.

            const taskInfo = this.workerTasks.get(worker);
            if (taskInfo) {
                taskInfo.done(err, null);
            } else {
                this.emit('error', err);
            }

            this.workerTasks.delete(worker);

            // Remove the worker from the list and start a new Worker to replace the
            // current one.
            this.workers.splice(this.workers.indexOf(worker), 1);
            this.addNewWorker();
        });

        this.workers.push(worker);
        this.freeWorkers.push(worker);
        this.emit(WorkerPool.kWorkerFreedEvent);
    }

    runTask(task: WorkerTask, callback: TaskInfoCallback) {
        if (this.freeWorkers.length === 0) {
            // No free threads, wait until a worker thread becomes free.
            this.tasks.push({ task, callback });
            return;
        }

        const worker = this.freeWorkers.pop();
        if (worker === undefined) {
            this.emit('error', "Unable to get free worker despite length !== 0");
            return;
        }

        this.workerTasks.set(worker, new WorkerPoolTaskInfo(callback));
        worker.postMessage(task);
    }

    runTaskPromise(task: WorkerTask): Promise<unknown> {
        return new Promise((resolve, reject) => {
            this.runTask(task, (err: Error, result: unknown) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result);
            });
        });
    }

    close() {
        for (const worker of this.workers) {
            worker.terminate();
        }
    }
}