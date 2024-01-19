import * as fswin from "fswin";
import FilesystemServer from "./filesystem-server";
import { Dirent, Stats } from "node:fs";


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
    protected async *_listDirectoryInPartitions(path: string, partitionSize: number) {
        if (path === "/") {
            const files = [];

            const drives = fswin.getLogicalDriveListSync();
            for (const drive of Object.keys(drives)) {
                files.push({
                    dirent: new WindowsDriveDirent(drive),
                    stats: new WindowsDriveStats(drive)
                })
            }

            yield files;
        }

        yield* super._listDirectoryInPartitions(path, partitionSize);
    }
}