import FileSystemClient from "../../services/filesystem-client";
import FileList from "../file-list/list";
import { useCallback, useEffect } from "react";
import NavigationToolbar from "../path-navigator/toolbar";
import usePathNavigator from "../path-navigator/usePathNavigator";
import FilesystemToolbar from "../filesystem-toolbar";
import FileView from "../file-view/file-view";
import useAwaitValue from "app/hooks/useAwaitValue";
import Configuration from "app/services/configuration";
import useFileBrowser from "./useFileBrowser";
import { ConfigurationOptions } from "app/configuration/store";

interface Props {
    path: string;
    config: ConfigurationOptions;
    className?: string;
}

export function FileBrowser({ path: initialPath, config, className }: Props) {
    const {
        state,
        currentFile,
        setCurrentFile,
        setAllFiles,
        getNextFile,
        getPreviousFile,
        setFileListMode,
        setViewHiddenFiles
    } = useFileBrowser(config);

    const { path, state: pathState, goBack, goForward, goUp, setPath } = usePathNavigator(initialPath);

    const getFilesForPath = useCallback(async (newPath: string) => {
        const fileInfo = await FileSystemClient.instance.quickStat(newPath);
        if (fileInfo.isFile) {
            setCurrentFile(fileInfo);
        } else {
            setCurrentFile(undefined);

            const files = await FileSystemClient.instance.listDir(newPath);

            setAllFiles(files);
        }
    }, [setCurrentFile, setAllFiles]);


    useEffect(() => {
        // TODO add support to abort file operations on unmounting
        getFilesForPath(path);
    }, [getFilesForPath, path]);


    const handleKeyPress = useCallback((ev: KeyboardEvent) => {
        const key = ev.key;
        if (key === "ArrowRight") {
            if (currentFile !== undefined) {
                const nextFile = getNextFile();
                if (nextFile) {
                    setPath(nextFile.path);
                }
            }
        } else if (key === "ArrowLeft") {
            if (currentFile !== undefined) {
                const previousFile = getPreviousFile();
                if (previousFile) {
                    setPath(previousFile.path);
                }
            }
        }
    }, [currentFile, setPath, getNextFile, getPreviousFile]);

    useEffect(() => {
        window.addEventListener("keyup", handleKeyPress);

        return () => {
            window.removeEventListener("keyup", handleKeyPress);
        }
    }, [handleKeyPress]);

    return (
        <div className={className}>
            <NavigationToolbar
                path={path}
                history={pathState.history}
                historyIndex={pathState.historyIndex}
                setPath={setPath}
                goUp={goUp}
                goBack={goBack}
                goFoward={goForward}
                refreshPath={() => getFilesForPath(path)}
            />

            {currentFile ? (
                <>
                    <div></div>
                    <FileView key={currentFile.path} file={currentFile} />
                </>
            ) : (
                <>
                    <FilesystemToolbar
                        mode={state.fileListMode}
                        setMode={setFileListMode}
                        viewHiddenFiles={state.viewHiddenFiles}
                        setViewHiddenFiles={setViewHiddenFiles}
                    />
                    <FileList files={state.files} mode={state.fileListMode} setPath={setPath} />
                </>
            )}
        </div>
    );
}

export default function PathFileBrowser() {
    // These values provide the initial state for the application
    // It is not necessary for them to be up-to-date
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