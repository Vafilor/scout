import { ObjectEncodingOptions, PathLike } from "node:fs";

export enum FileType {
    File,
    Directory,
    Socket
}

export interface AppFile {
    name: string;
    path: string;
    type: FileType;
    size?: number; // bytes
}

export type ReaddirOptions = ObjectEncodingOptions & {
    withFileTypes: boolean;
    recursive?: boolean | undefined;
};

export interface IFilesystemAPI {
    getTextFileContents: (path: PathLike) => Promise<string>;
    stat: (path: PathLike) => Promise<Required<AppFile>>;
    readdir: (path: PathLike) => Promise<AppFile[]>;
    getUserHomeDirectory: () => Promise<string>;
    getImageIconPath: (path: PathLike, width: number, height: number) => Promise<string>;
    getHeicFile: (path: PathLike) => Promise<HeicFileResponse>;
}

export enum FileListMode {
    List = "list",
    Icons = "icons"
}

export interface HeicFileResponse {
    data: Uint8ClampedArray;
    width: number;
    height: number;
}