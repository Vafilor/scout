import { AppFile, FileListMode, FileType } from "app/types/filesystem";
import { SortableFileColumn, getSortForAppFiles } from "./sort";
import { replaceArrayItem } from "./utils";

export interface State {
    loadingFileContent: boolean;

    history: PathInfo[]; // history of the paths navgiated.
    historyIndex: number; // Where we are in the history.

    // All of the files for the current directory, or the directory containing the currently viewed file
    // null means we do not know if there are any files yet
    allFiles: AppFile[] | null;
    files: AppFile[]; // The files we can see after any filtering/sorting
    currentFileIndex: number; // When viewing a file, this is the current index in files. -1 means none.

    // Config section
    fileListMode: FileListMode;
    showHiddenFiles: boolean;
    sortColumn?: SortableFileColumn;
}

export interface PathInfo {
    path: string;
    type?: FileType;
}

interface FileListConfig {
    showHiddenFiles: boolean;
    sortColumn?: SortableFileColumn;
}

export enum ActionType {
    SetPath,
    SetCurrentPathInfo,
    Back,
    Forward,
    SetFileListMode,
    SetShowHiddenFiles,
    SetFile, // Anything that isn't a directory
    SetDirectory,
    SetLoading,
    SetColumnSort
}

export interface SetPathAction {
    type: ActionType.SetPath;
    payload: {
        path: string;
        type?: FileType;
    }
}

export interface SetCurrentPathInfoAction {
    type: ActionType.SetCurrentPathInfo;
    payload: {
        type: FileType
    }
}

export interface BackAction {
    type: ActionType.Back;
}

export interface ForwardAction {
    type: ActionType.Forward;
}

export interface SetFileListModeAction {
    type: ActionType.SetFileListMode;
    payload: FileListMode;
}

export interface SetShowHiddenFilesAction {
    type: ActionType.SetShowHiddenFiles;
    payload: boolean;
}

export interface SetDirectoryAction {
    type: ActionType.SetDirectory;
    payload: AppFile[];
}

export interface SetFileAction {
    type: ActionType.SetFile;
    payload: {
        path: string | null;
    }
}

export interface SetLoadingAction {
    type: ActionType.SetLoading,
    payload: {
        loading: boolean
    }
}

export interface SetColumnSortAction {
    type: ActionType.SetColumnSort;
    payload?: SortableFileColumn;
}

type Action =
    | SetPathAction
    | SetCurrentPathInfoAction
    | ForwardAction
    | BackAction
    | SetFileListModeAction
    | SetShowHiddenFilesAction
    | SetDirectoryAction
    | SetFileAction
    | SetLoadingAction
    | SetColumnSortAction;

export interface InitialStateConfig {
    fileType?: FileType;
    fileListMode: FileListMode;
    showHiddenFiles: boolean;
}

// TODO this is not windows compatible at the moment
function isHiddenFile(file: AppFile): boolean {
    return file.name.charAt(0) === ".";
}

function filterFiles(files: AppFile[], config: FileListConfig): AppFile[] {
    if (config.showHiddenFiles) {
        return files;
    }

    return files.filter((file) => !isHiddenFile(file))
}

function processFiles(files: AppFile[] | null, config: FileListConfig): AppFile[] {
    if (files === null) {
        return [];
    }

    const result = filterFiles(files, config);

    if (config.sortColumn) {
        result.sort(getSortForAppFiles(config.sortColumn));
    }

    return result;
}

export function getInitialState(config: InitialStateConfig): State {
    return {
        loadingFileContent: true,
        history: [],
        historyIndex: -1,
        allFiles: [],
        files: [],
        currentFileIndex: -1,
        sortColumn: SortableFileColumn.CanonicalName,
        ...config
    };
}

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.SetPath: {
            // If we change paths when we went "back", the current position will be the starting point
            // of the new history
            // action.payload = "/Users/byte"
            // ["/", "/Users", "/Users/nibble"]
            //          ^- we are here
            // ["/", "/Users", "/Users/byte"] <- new history. "/Users/nibble" is discarded
            const newHistory = state.history.slice(0, state.historyIndex + 1).concat({
                path: action.payload.path,
                type: action.payload.type
            });

            return {
                ...state,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        }
        case ActionType.SetCurrentPathInfo: {
            const currentPath = state.history[state.historyIndex];

            return {
                ...state,
                history: replaceArrayItem(state.history, state.historyIndex, {
                    path: currentPath.path,
                    type: action.payload.type
                })
            };
        }
        case ActionType.Back: {
            if (state.historyIndex <= 0) {
                throw new Error("Unable to go back, already at the start");
            }

            return {
                ...state,
                historyIndex: state.historyIndex - 1,
            };
        }
        case ActionType.Forward: {
            if (state.historyIndex === (state.history.length - 1)) {
                throw new Error("Unable to go forward, already at the end");
            }

            return {
                ...state,
                historyIndex: state.historyIndex + 1,
            };
        }
        case ActionType.SetFileListMode: {
            return {
                ...state,
                fileListMode: action.payload
            };
        }
        case ActionType.SetShowHiddenFiles: {
            return {
                ...state,
                showHiddenFiles: action.payload,
                files: processFiles(state.allFiles, { showHiddenFiles: action.payload })
            };
        }
        case ActionType.SetDirectory: {
            return {
                ...state,
                allFiles: action.payload,
                files: processFiles(action.payload, state)
            };
        }
        case ActionType.SetFile: {
            if (state.allFiles === null) {
                throw new Error("Can not select file, allFiles is currently not set");
            }

            const currentFileIndex = action.payload.path ?
                state.files.findIndex((file) => file.path === action.payload.path) :
                -1;

            if (action.payload.path && currentFileIndex === -1) {
                throw new Error(`Current file '${action.payload.path}' is not in available files.`);
            }

            return {
                ...state,
                currentFileIndex
            };
        }
        case ActionType.SetLoading: {
            return {
                ...state,
                loadingFileContent: action.payload.loading
            }
        }
        case ActionType.SetColumnSort: {
            return {
                ...state,
                sortColumn: action.payload
            };
        }
    }
}