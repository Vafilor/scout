interface IPathClient {
    getPathUp(path: string): string;
    canGoUp(path: string): boolean;
    split(path: string): string[];
    partialPath(parts: string[], index: number): string;

    // Converts a path to a URL that is compatible with NodeJS Url parsing
    // e.g. windows should replace \\ with something else.
    toLocalURL(path: string): string;
}

export class IxPathClient implements IPathClient {
    getPathUp(path: string): string {
        if (path === "/") {
            throw new Error("Unable to go up from root");
        }

        const lastIndexOfSlash = path.lastIndexOf('/');
        if (lastIndexOfSlash === -1) {
            throw new Error("No '/' detected in path. Unable to get path up");
        }

        if (lastIndexOfSlash === 0 && path !== "/") {
            return "/";
        }

        return path.substring(0, lastIndexOfSlash);
    }

    canGoUp(path: string): boolean {
        return path !== "/" && path.lastIndexOf('/') > -1;
    }

    split(path: string): string[] {
        return path.split('/').filter(part => !!part.length);
    }

    partialPath(parts: string[], index: number): string {
        return "/" + parts.slice(0, index + 1).join("/");
    }

    toLocalURL(path: string): string {
        return path;
    }
}

export class WindowsPathClient implements IPathClient {
    getPathUp(path: string): string {
        const lastIndexOfSlash = path.lastIndexOf('\\');
        if (lastIndexOfSlash === -1) {
            throw new Error("No '\\' detected in path. Unable to get path up");
        }

        return path.substring(0, lastIndexOfSlash);
    }

    canGoUp(path: string): boolean {
        return path.lastIndexOf('\\') > -1;
    }

    split(path: string): string[] {
        return path.split('\\').filter(part => !!part.length);
    }

    partialPath(parts: string[], index: number): string {
        if (index === -1) {
            return "/";
        }
        return parts.slice(0, index + 1).join("\\");
    }

    toLocalURL(path: string): string {
        return path.replaceAll('\\', '/');
    }
}

export default class PathClient {
    private static _instance: IPathClient | null;
    public static init(client: IPathClient): IPathClient {
        if (!PathClient._instance) {
            PathClient._instance = client;
        }

        return PathClient._instance;
    }

    static get instance(): IPathClient {
        if (!PathClient._instance) {
            throw new Error("PathClient has not been initialized. Call PathClient.init(...) first");
        }

        return PathClient._instance;
    }
}