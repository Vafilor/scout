import FileSystemClient from "../../services/filesystem-client";
import FileList from "../file-list/list";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import NavigationToolbar from "../path-navigator/toolbar";
import FilesystemToolbar from "../filesystem-toolbar";
import FileView from "../file-view/file-view";
import useAwaitValue from "app/hooks/useAwaitValue";
import Configuration from "app/services/configuration";
import useFileBrowser from "./useFileBrowser";
import { ConfigurationOptions } from "app/configuration/store";
import SplitPane from "../split-pane/split-pane";
import { useWindowSize } from "@uidotdev/usehooks";
import Rectangle from "../loading/rectangle";
import { State } from "./reducer";

interface Props {
    path: string;
    config: ConfigurationOptions;
    className?: string;
}

export function FileBrowser({ path, config, className }: Props) {
    const [navigationToolbarHeight, setNavigationToolbarHeight] = useState(0);
    const [filesystemToolbarHeight, setFilesystemToolbarHeight] = useState(0);
    const [footerHeight, setFooterHeight] = useState(0);

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

    const { width, height } = useWindowSize();
    const contentHeight = height ? height - filesystemToolbarHeight - footerHeight - navigationToolbarHeight : 0;

    return (
        <div className={`${className} flex flex-col`}>
            {pathInfo && (
                <NavigationToolbar
                    ref={(node) => setNavigationToolbarHeight(node?.offsetHeight || 0)}
                    pathInfo={pathInfo}
                    history={state.history}
                    historyIndex={state.historyIndex}
                    setPath={setPath}
                    goUp={goUp}
                    goBack={goBack}
                    goFoward={goForward}
                    refreshPath={reloadDirectory}
                />
            )}
            <FilesystemToolbar
                ref={(node) => setFilesystemToolbarHeight(node?.offsetHeight || 0 + (node?.offsetTop || 0))}
                mode={state.fileListMode}
                setMode={setFileListMode}
                viewHiddenFiles={state.showHiddenFiles}
                setViewHiddenFiles={setViewHiddenFiles}
            />
            <SplitPane
                first={<div>Left</div>}
                renderSecond={(width) => (
                    state.loadingFileContent ? (
                        <div className="grow" style={{ height: contentHeight }}>
                            <Rectangle className="m-2 h-full" />
                        </div>
                    ) : currentFile ? (
                        <FileView
                            key={currentFile.path}
                            file={currentFile}
                            className="grow"
                        />
                    ) : (
                        <FileList
                            files={state.files}
                            width={width}
                            mode={state.fileListMode}
                            setPath={setChildPath}
                            height={contentHeight}
                            className="grow"
                        />
                    )
                )}
                defaultWidth={180}
                minWidth={100}
                totalWidth={width ?? 0}
                className="overflow-hidden"
            />
            <Footer
                ref={(node) => setFooterHeight(node?.offsetHeight || 0)}
                state={state}
            />
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
            className="h-screen"
        />
    );
}

const Footer = forwardRef<HTMLDivElement, { state: State }>(({ state }, ref) => {
    return (
        <div
            ref={ref}
            className="px-2 py-1 shrink-0 text-sm text-left">
            {state.loadingFileContent ? "Loading..." : (
                <span>{state.files.length} {pluralizeItems(state.files.length)}</span>
            )}
        </div>
    );
});

function pluralizeItems(count: number): string {
    if (count === 1) {
        return "item";
    }

    return "items";
}