import { FileType } from "app/types/filesystem";
import { Stats } from "node:fs";

export function fileStatToType(stat: Stats): FileType {
    if (stat.isFile()) {
        return FileType.File;
    }

    if (stat.isDirectory()) {
        return FileType.Directory;
    }

    throw new Error("fileStatToType only supports files and directories");
}