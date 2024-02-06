import FileSystemClient from "../../services/filesystem-client";
import FileList from "../file-list/list";
import { useCallback, useEffect } from "react";
import NavigationToolbar from "../path-navigator/toolbar";
import FilesystemToolbar from "../filesystem-toolbar";
import FileView from "../file-view/file-view";
import useAwaitValue from "app/hooks/useAwaitValue";
import Configuration from "app/services/configuration";
import useFileBrowser from "./useFileBrowser";
import { ConfigurationOptions } from "app/configuration/store";
import FileViewToolbar from "../file-view/file-view-toolbar";
import { FileType } from "app/types/filesystem";

interface Props {
    path: string;
    config: ConfigurationOptions;
    className?: string;
}

export function FileBrowser({ path, config, className }: Props) {
    const {
        state,
        currentFile,
        pathInfo,
        setPath,
        setChildPath,
        goUp,
        goBack,
        goForward,
        getNextFile,
        getPreviousFile,
        setFileListMode,
        setViewHiddenFiles,
        reloadDirectory
    } = useFileBrowser(path, config);

    const handleKeyPress = useCallback((ev: KeyboardEvent) => {
        const key = ev.key;
        if (key === "ArrowRight") {
            if (currentFile !== undefined) {
                const nextFile = getNextFile();
                if (nextFile) {
                    setChildPath(nextFile.path);
                }
            }
        } else if (key === "ArrowLeft") {
            if (currentFile !== undefined) {
                const previousFile = getPreviousFile();
                if (previousFile) {
                    setChildPath(previousFile.path);
                }
            }
        }
    }, [currentFile, setChildPath, getNextFile, getPreviousFile]);

    useEffect(() => {
        window.addEventListener("keyup", handleKeyPress);

        return () => {
            window.removeEventListener("keyup", handleKeyPress);
        }
    }, [handleKeyPress]);

    return (
        <div className={className}>
            {pathInfo && (
                <NavigationToolbar
                    pathInfo={pathInfo}
                    history={state.history}
                    historyIndex={state.historyIndex}
                    setPath={setPath}
                    goUp={goUp}
                    goBack={goBack}
                    goFoward={goForward}
                    refreshPath={() => reloadDirectory()}
                />
            )}
            {pathInfo?.type === undefined ? (
                <div className="h-[40px] border-slate-300 border-b"></div>
            ) : pathInfo.type === FileType.File ? (
                <FileViewToolbar name={currentFile?.name || ""}></FileViewToolbar>
            ) : (
                <FilesystemToolbar
                    mode={state.fileListMode}
                    setMode={setFileListMode}
                    viewHiddenFiles={state.showHiddenFiles}
                    setViewHiddenFiles={setViewHiddenFiles}
                />
            )}
            {state.loadingFileContent ? (
                <div>Loading</div>
            ) : currentFile ? (
                <FileView key={currentFile.path} file={currentFile} />
            ) : (
                <FileList files={state.files} mode={state.fileListMode} setPath={setChildPath} />
            )}
        </div>
    );
}

export default function PathFileBrowser() {
    // These values provide the initial state for the application
    // It is not necessary for them to update the FileBrowser on change, so we only get them once.
    const { value: homeDirectory, loading: homeDirectoryLoading } = useAwaitValue(() => FileSystemClient.instance.getUserHomeDirectory());
    const { value: config, loading: configLoading } = useAwaitValue(() => Configuration.instance.getOptions());

    const loading = homeDirectoryLoading || configLoading;

    // TODO prettier loading
    if (loading) {
        return <div>Loading</div>;
    }

    if (!config || !homeDirectory) {
        throw new Error("Loading is done, but config and home directory are not available");
    }

    return (
        <FileBrowser
            path={homeDirectory}
            config={config}
            className="h-screen grid grid-cols-1 grid-rows-[min-content_min-content_1fr]"
        />
    );
}