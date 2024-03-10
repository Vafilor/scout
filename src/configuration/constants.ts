import { join } from "node:path";

export enum ConfigurationNames {
    AppSettings = "configuration.json",
    ImageCache = "image_cache",
    FileDatabase = "file_database.db",
    NavigationPathSettings = "navigationPath.json"
}

export interface ConstantsArguments {
    appMode: string;
    dirname: string;
    resourcesPath: string;
}

export class Constants {
    private constructor(private readonly args: ConstantsArguments) {
    }

    private static _instance: Constants | null = null;

    static init(args: ConstantsArguments): Constants {
        if (!Constants._instance) {
            Constants._instance = new Constants(args);
        }

        return Constants._instance;
    }

    static get instance(): Constants {
        if (!Constants._instance) {
            throw new Error("Constants has not been initialized. Call Constants.init(...) first");
        }

        return Constants._instance;
    }

    getFfmpegBinaryPath(): string {
        const extension = process.platform === "win32" ? ".exe" : "";
        if (this.args.appMode === 'dev') {
            return join(this.args.dirname, "ffmpeg" + extension);
        } else {
            return join(this.args.resourcesPath, "ffmpeg" + extension);
        }
    }

    getDrizzleMigrationsDirectory(): string {
        if (this.args.appMode === 'dev') {
            return join(this.args.dirname, "..", "..", "drizzle")
        } else {
            return join(this.args.resourcesPath, "drizzle");
        }
    }
}