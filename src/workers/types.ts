export enum TaskAction {
    LoadHeicData,
    CreateIcon
}

export interface LoadHeicDataTask {
    type: TaskAction.LoadHeicData;
    path: string;
}

export interface CreateIconTask {
    type: TaskAction.CreateIcon;
    inputPath: string;
    outputPath: string;
    width: number;
    height: number;
}

export type WorkerTask = LoadHeicDataTask | CreateIconTask;
