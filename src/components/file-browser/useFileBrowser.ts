import { useCallback, useMemo, useReducer } from "react";
import { ActionType, InitialStateConfig, getInitialState, reducer } from "./reducer";
import { AppFile, FileListMode } from "app/types/filesystem";
import Configuration from "app/services/configuration";

export default function useFileBrowser(config: Partial<InitialStateConfig>) {
    const [state, dispatch] = useReducer(reducer, config, getInitialState);

    const currentFile = useMemo(() => {
        return state.currentFileIndex === -1 ? undefined : state.files[state.currentFileIndex];
    }, [state.currentFileIndex, state.files]);

    const setAllFiles = useCallback((files: AppFile[]) => {
        dispatch({
            type: ActionType.SetAllFiles,
            payload: files
        });
    }, [dispatch]);

    const setCurrentFile = useCallback((file: AppFile | undefined) => {
        dispatch({
            type: ActionType.SetCurrentFile,
            payload: file
        });
    }, [dispatch]);

    const getNextFile = useCallback(() => {
        if (state.currentFileIndex === -1) {
            throw new Error("Can not viewNextFile, not currently viewing a file");
        }

        for (let i = state.currentFileIndex + 1; i < state.files.length; i++) {
            const file = state.files[i];
            // Skip directories
            if (file.isFile) {
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
            if (file.isFile) {
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
    }, [dispatch]);

    const setViewHiddenFiles = useCallback((viewHiddenFiles: boolean) => {
        dispatch({
            type: ActionType.SetViewHiddenFiles,
            payload: viewHiddenFiles
        });

        Configuration.instance.updateOptions({
            showHiddenFiles: viewHiddenFiles
        });
    }, [dispatch]);

    return {
        state,
        currentFile,
        setAllFiles,
        setCurrentFile,
        getNextFile,
        getPreviousFile,
        setFileListMode,
        setViewHiddenFiles
    };
}