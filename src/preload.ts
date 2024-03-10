// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { AppFile } from "./types/filesystem";
import { ConfigurationOptions } from "./configuration/store";
import { PathLike } from "node:fs";
import { NavigationPath } from "./navigation-paths/types";

contextBridge.exposeInMainWorld('environment', {
    platform: process.platform
});

contextBridge.exposeInMainWorld('appFilesystem', {
    getTextFileContents: (path: PathLike): Promise<string> => ipcRenderer.invoke('filesystem-get-text-file', path),
    stat: (path: PathLike): Promise<AppFile> => ipcRenderer.invoke('filesystem-file-stat', path),
    readdir: (path: PathLike)
        : Promise<AppFile[]> => ipcRenderer.invoke('filesystem-list', path),
    getUserHomeDirectory: () => ipcRenderer.invoke('filesystem-get-home-directory'),
    getImageIconPath: (path: PathLike, width: number, height: number): Promise<string> =>
        ipcRenderer.invoke('filesystem-get-image-icon-path', path, width, height),
    getHeicFile: (path: PathLike) => ipcRenderer.invoke('filesystem-get-heic-file', path)
});

contextBridge.exposeInMainWorld('appConfig', {
    getOptions: (): Promise<ConfigurationOptions> => ipcRenderer.invoke('config-get'),
    updateOptions: (options: Partial<ConfigurationOptions>) => ipcRenderer.invoke('config-update', options)
});

contextBridge.exposeInMainWorld('appNavigationPaths', {
    get: (): Promise<NavigationPath[]> => ipcRenderer.invoke('navigation-paths-get'),
    update: (paths: NavigationPath[]) => ipcRenderer.invoke('navigation-paths-update', paths)
});