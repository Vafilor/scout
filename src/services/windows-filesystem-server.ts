import * as fswin from "fswin";
import FilesystemServer from "./filesystem-server";
import { Dirent, Stats } from "node:fs";
import { AppFile, FileType } from "app/types/filesystem";


class WindowsDriveDirent extends Dirent {
    static formatWindowsDriveName(drive: string, label: string): string {
        if (label === "") {
            return drive + ":";
        }

        return `${label} (${drive}:)`;
    }

    constructor(drive: string) {
        super();

        const volumeInfo = fswin.getVolumeInformationSync(drive + ":\\\\");
        this.name = WindowsDriveDirent.formatWindowsDriveName(drive, volumeInfo.LABEL);
        this.path = drive + ":\\" + volumeInfo.LABEL;
    }

    isFile(): boolean {
        return false;
    }

    isDirectory(): boolean {
        return true;
    }

    isBlockDevice(): boolean {
        return true;
    }

    isCharacterDevice(): boolean {
        return true;
    }

    isSymbolicLink(): boolean {
        return false;
    }

    isFIFO(): boolean {
        return false;
    }

    isSocket(): boolean {
        return false;
    }
}

class WindowsDriveStats extends Stats {
    constructor(private drive: string) {
        super();

        const drivePath = drive + ":\\\\";

        this.size = fswin.getVolumeSpaceSync(drivePath).TOTAL;
    }

    isFile(): boolean {
        return false;
    }

    isDirectory(): boolean {
        return true;
    }

    isBlockDevice(): boolean {
        return true;
    }

    isCharacterDevice(): boolean {
        return true;
    }

    isSymbolicLink(): boolean {
        return false;
    }

    isFIFO(): boolean {
        return false;
    }

    isSocket(): boolean {
        return false;
    }
}

export default class WindowsFilesystemServer extends FilesystemServer {
    async listDirectory(path: string): Promise<AppFile[]> {
        if (path === "/") {
            const files: AppFile[] = [];

            const drives = fswin.getLogicalDriveListSync();
            for (const drive of Object.keys(drives)) {
                const dirent = new WindowsDriveDirent(drive);
                const stats = new WindowsDriveStats(drive);
                files.push({
                    name: dirent.name,
                    path: dirent.path,
                    size: stats.size,
                    type: FileType.Directory
                })
            }

            return files;
        }

        return super.listDirectory(path);
    }
}