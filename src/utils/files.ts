
export function getExtension(name: string): string | null {
    const lastDotIndex = name.lastIndexOf('.');
    if (lastDotIndex === -1) {
        return null;
    }

    return name.substring(lastDotIndex + 1);
}

export function isImageExtension(extension: string): boolean {
    const e = extension.toLowerCase();

    return e === "png" ||
        e === "jpeg" ||
        e === "jpg" ||
        e === "svg" ||
        e === "gif" ||
        e === "heic";
}

export function isVideoExtension(extension: string): boolean {
    const e = extension.toLowerCase();

    return e === "mp4" ||
        e === "webm" ||
        e === "mov";
}

export function canCreateImageIcon(extension: string): boolean {
    return isImageExtension(extension) || isVideoExtension(extension);
}

const fileSizes = ["B", "KB", "MB", "GB", "TB"];

export function humanizeSize(sizeInBytes: number): string {
    let size = sizeInBytes;
    let index = 0;

    while (size > 1024) {
        size /= 1024.0;
        index++;

        if (index === fileSizes.length - 1) {
            break;
        }
    }

    return `${size.toFixed(2)} ${fileSizes[index]}`;
}