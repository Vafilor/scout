import { AppFile, FileListMode } from "app/types/filesystem";

export interface State {
    allFiles: AppFile[]; // All of the current directory files
    files: AppFile[]; // The files we currently see
    currentFileIndex: number; // When viewing a file, this is the current index in files. -1 means none.
    fileListMode: FileListMode;
    viewHiddenFiles: boolean;
}

interface FileListConfig {
    viewHiddenFiles: boolean;
}

export enum ActionType {
    SetFileListMode,
    SetViewHiddenFiles,
    SetAllFiles,
    SetCurrentFile
}

export interface SetFileListModeAction {
    type: ActionType.SetFileListMode;
    payload: FileListMode;
}

export interface SetViewHiddenFilesAction {
    type: ActionType.SetViewHiddenFiles;
    payload: boolean;
}

export interface SetAllFilesAction {
    type: ActionType.SetAllFiles;
    payload: AppFile[];
}

export interface SetCurrentFileAction {
    type: ActionType.SetCurrentFile;
    payload: AppFile | undefined;
}

type Action =
    | SetFileListModeAction
    | SetViewHiddenFilesAction
    | SetAllFilesAction
    | SetCurrentFileAction;

export interface InitialStateConfig {
    fileListMode: FileListMode;
    showHiddenFiles: boolean;
}

// TODO this is not windows compatible at the moment
function isHiddenFile(file: AppFile): boolean {
    return file.name.charAt(0) === ".";
}

function filterFiles(files: AppFile[], config: FileListConfig): AppFile[] {
    if (config.viewHiddenFiles) {
        return files;
    }

    return files.filter((file) => !isHiddenFile(file))
}

export function getInitialState(config: Partial<InitialStateConfig>): State {
    return {
        allFiles: [],
        files: [],
        currentFileIndex: -1,
        fileListMode: FileListMode.List,
        viewHiddenFiles: false,
        ...config
    };
}

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.SetFileListMode: {
            return {
                ...state,
                fileListMode: action.payload
            };
        }
        case ActionType.SetViewHiddenFiles: {
            return {
                ...state,
                viewHiddenFiles: action.payload,
                files: filterFiles(state.allFiles, { viewHiddenFiles: action.payload })
            };
        }
        case ActionType.SetAllFiles: {
            return {
                ...state,
                allFiles: action.payload,
                files: filterFiles(action.payload, state)
            };
        }
        case ActionType.SetCurrentFile: {
            const currentFileIndex = action.payload ?
                state.files.findIndex((file) => file.path === action.payload?.path) :
                -1;

            if (action.payload && currentFileIndex === -1) {
                throw new Error(`Current file '${action.payload?.name}' is not in available files.`);
            }
            return {
                ...state,
                currentFileIndex
            };
        }
    }
}