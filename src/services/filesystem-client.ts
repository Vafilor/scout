import { AppFile, HeicFileResponse, IFilesystemAPI } from "../types/filesystem";

export default class FileSystemClient {
    private static _instance: FileSystemClient | null;
    public static init(fileServer: IFilesystemAPI): FileSystemClient {
        if (!FileSystemClient._instance) {
            FileSystemClient._instance = new FileSystemClient(fileServer);
        }

        return FileSystemClient._instance;
    }

    static get instance(): FileSystemClient {
        if (!FileSystemClient._instance) {
            throw new Error("FilesystemClient has not been initialized. Call FileSystemClient.init(...) first");
        }

        return FileSystemClient._instance;
    }

    // key is full file path
    private fileCache = new Map<string, AppFile>();

    private constructor(private fileServer: IFilesystemAPI) {
    }

    async listDir(path: string): Promise<AppFile[]> {
        const results = await this.fileServer.readdir(path);

        this.fileCache.clear();
        for (const file of results) {
            this.fileCache.set(file.path, file);
        }

        return results;
    }

    getUserHomeDirectory(): Promise<string> {
        return this.fileServer.getUserHomeDirectory();
    }

    async quickStat(path: string): Promise<AppFile> {
        const cachedFile = this.fileCache.get(path);
        if (cachedFile) {
            return cachedFile;
        }

        return this.fileServer.stat(path);
    }

    stat(path: string): Promise<Required<AppFile>> {
        return this.fileServer.stat(path);
    }

    getTextFileContext(path: string): Promise<string> {
        return this.fileServer.getTextFileContents(path);
    }

    getImageIconPath(path: string, width: number, height: number): Promise<string> {
        return this.fileServer.getImageIconPath(path, width, height);
    }

    getHeicFile(path: string): Promise<HeicFileResponse> {
        return this.fileServer.getHeicFile(path);
    }
}