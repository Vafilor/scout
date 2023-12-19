import { ObjectEncodingOptions, PathLike } from "node:fs";

export interface AppFile {
    name: string;
    path: string;
    isFile: boolean;
    size?: number; // bytes
}

export type ReaddirOptions = ObjectEncodingOptions & {
    withFileTypes: boolean;
    recursive?: boolean | undefined;
};

export interface IFilesystemAPI {
    getTextFileContents: (path: PathLike) => Promise<string>;
    stat: (path: PathLike) => Promise<Required<AppFile>>;
    readdir: (path: PathLike, options?: ReaddirOptions) => Promise<AppFile[]>;
    getUserHomeDirectory: () => Promise<string>;
    getImageIconPath: (path: PathLike, width: number, height: number) => Promise<string>;
}

export enum FileListMode {
    List = "list",
    Icons = "icons"
}