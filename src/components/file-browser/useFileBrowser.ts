import { useCallback, useEffect, useMemo, useReducer } from "react";
import { ActionType, InitialStateConfig, getInitialState, reducer } from "./reducer";
import { FileListMode, FileType } from "app/types/filesystem";
import Configuration from "app/services/configuration";
import PathClient from "app/services/path";
import FileSystemClient from "app/services/filesystem-client";

export default function useFileBrowser(path: string, config: InitialStateConfig) {
    const [state, dispatch] = useReducer(reducer, config, getInitialState);

    const currentFile = useMemo(() => {
        return state.currentFileIndex === -1 ? undefined : state.files[state.currentFileIndex];
    }, [state.currentFileIndex, state.files]);

    const pathInfo = useMemo(() => {
        return state.history.length ? state.history[state.historyIndex] : null
    }, [state.history, state.historyIndex]);

    // onPathSet handles the logic of when a path has been changed
    // it does not dispatch SetPath, since that impacts history navigation
    // and this is used when going back/forward through history
    const onPathSet = useCallback(async (newPath: string) => {
        dispatch({
            type: ActionType.SetLoading,
            payload: { loading: true }
        });

        const fileInfo = await FileSystemClient.instance.quickStat(newPath);

        dispatch({
            type: ActionType.SetCurrentPathInfo,
            payload: { type: fileInfo.type }
        });

        switch (fileInfo.type) {
            case FileType.File: {
                dispatch({
                    type: ActionType.SetFile,
                    payload: {
                        path: newPath
                    }
                });

                const parentFiles = await FileSystemClient.instance.listDir(
                    PathClient.instance.getPathUp(newPath)
                );

                dispatch({
                    type: ActionType.SetDirectory,
                    payload: parentFiles
                });

                break;
            }
            case FileType.Directory: {
                dispatch({
                    type: ActionType.SetFile,
                    payload: {
                        path: null
                    }
                });

                dispatch({
                    type: ActionType.SetDirectory,
                    payload: await FileSystemClient.instance.listDir(newPath)
                });
                break;
            }
            default:
                throw new Error(`File type '${fileInfo.type}' is not supported yet`);
        }

        dispatch({
            type: ActionType.SetLoading,
            payload: { loading: false }
        });
    }, [dispatch]);

    // Set the path to a file when you don't know anything about it
    const setPath = useCallback(async (newPath: string) => {
        dispatch({
            type: ActionType.SetPath,
            payload: {
                path: newPath,
            }
        });

        onPathSet(newPath);
    }, [onPathSet, dispatch]);

    // Set a path that is a child of the current directory listing
    // Use this when you know the newPath is in the current directory
    // It is slightly more efficient because we already have some information about the file
    const setChildPath = useCallback(async (newPath: string) => {
        if (state.allFiles === null) {
            throw new Error("Unable to set child path, no current files");
        }

        const selectedFile = state.allFiles.find(f => f.path === newPath);
        if (!selectedFile) {
            throw new Error(`File with path '${newPath}' not found in current files`);
        }

        dispatch({
            type: ActionType.SetPath,
            payload: {
                path: newPath,
                type: selectedFile.type
            }
        });

        switch (selectedFile.type) {
            case FileType.File: {
                dispatch({
                    type: ActionType.SetFile,
                    payload: {
                        path: selectedFile.path
                    }
                });

                break;
            }
            case FileType.Directory: {
                dispatch({
                    type: ActionType.SetLoading,
                    payload: { loading: true }
                });

                dispatch({
                    type: ActionType.SetDirectory,
                    payload: await FileSystemClient.instance.listDir(newPath)
                });

                dispatch({
                    type: ActionType.SetLoading,
                    payload: { loading: false }
                });

                break;
            }
            default:
                throw new Error(`File type ${selectedFile.type} is not supported yet`);
        }

    }, [state.allFiles, dispatch]);

    const reloadDirectory = useCallback(async () => {
        if (pathInfo === null) {
            throw new Error("Current path not set.")
        }

        dispatch({
            type: ActionType.SetLoading,
            payload: { loading: true }
        });

        dispatch({
            type: ActionType.SetDirectory,
            payload: await FileSystemClient.instance.listDir(pathInfo.path)
        });

        dispatch({
            type: ActionType.SetLoading,
            payload: { loading: false }
        });

    }, [pathInfo, dispatch]);

    const goUp = useCallback(() => {
        const pathUp = PathClient.instance.getPathUp(state.history[state.historyIndex].path);
        setPath(pathUp);
    }, [state.history, state.historyIndex, setPath]);

    const goBack = useCallback(() => {
        dispatch({
            type: ActionType.Back
        });

        const previousPath = state.history[state.historyIndex - 1];

        onPathSet(previousPath.path);
    }, [state.history, state.historyIndex, dispatch, onPathSet]);

    const goForward = useCallback(() => {
        dispatch({
            type: ActionType.Forward
        });

        const nextPath = state.history[state.historyIndex + 1];

        onPathSet(nextPath.path);
    }, [state.history, state.historyIndex, dispatch, onPathSet]);

    const getNextFile = useCallback(() => {
        if (state.currentFileIndex === -1) {
            throw new Error("Can not viewNextFile, not currently viewing a file");
        }

        for (let i = state.currentFileIndex + 1; i < state.files.length; i++) {
            const file = state.files[i];
            // Skip directories
            if (file.type === FileType.File) {
                return file;
            }
        }

        // No more files
        return null;
    }, [state.currentFileIndex, state.files]);

    const getPreviousFile = useCallback(() => {
        if (state.currentFileIndex === -1) {
            throw new Error("Can not viewPreviousFile, not currently viewing a file");
        }

        for (let i = state.currentFileIndex - 1; i > -1; i--) {
            const file = state.files[i];
            // Skip directories
            if (file.type === FileType.File) {
                return file;
            }
        }

        // No more files
        return null;
    }, [state.currentFileIndex, state.files]);

    const setFileListMode = useCallback((listMode: FileListMode) => {
        dispatch({
            type: ActionType.SetFileListMode,
            payload: listMode
        })

        Configuration.instance.updateOptions({
            fileListMode: listMode
        });
    }, [dispatch]);

    const setViewHiddenFiles = useCallback((viewHiddenFiles: boolean) => {
        dispatch({
            type: ActionType.SetShowHiddenFiles,
            payload: viewHiddenFiles
        });

        Configuration.instance.updateOptions({
            showHiddenFiles: viewHiddenFiles
        });
    }, [dispatch]);

    // Set the initial path. This should only happen when the input path changes
    useEffect(() => {
        setPath(path);
    }, [path, setPath]);

    return {
        state,
        currentFile,
        pathInfo,
        setPath,
        setChildPath,
        reloadDirectory,
        goBack,
        goForward,
        goUp,
        getNextFile,
        getPreviousFile,
        setFileListMode,
        setViewHiddenFiles
    };
}