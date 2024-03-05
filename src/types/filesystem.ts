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
    ExtraLargeIcons = "extra_large_icons",
    LargeIcons = "large_icons",
    MediumIcons = "medium_icons",
    SmallIcons = "Small",
}

export function iconListModeToSize(mode: FileListMode): number {
    if (mode === FileListMode.List) {
        throw new Error("List mode is not supported");
    }

    switch (mode) {
        case FileListMode.SmallIcons:
            return 64;
        case FileListMode.MediumIcons:
            return 128;
        case FileListMode.LargeIcons:
            return 256;
        case FileListMode.ExtraLargeIcons:
            return 512;
    }
}

export interface HeicFileResponse {
    data: Uint8ClampedArray;
    width: number;
    height: number;
}