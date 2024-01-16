import { join } from "node:path";

export enum ConfigurationNames {
    AppSettings = "configuration.json",
    ImageCache = "image_cache",
    FileDatabase = "file_database.db"
}

// TODO the extension might vary based on os
export function getFfmpegBinaryPath(): string {
    if (process.env.APP_MODE === 'dev') {
        return join(__dirname, "ffmpeg");
    } else {
        return join(process.resourcesPath, "ffmpeg");
    }
}

export function getDrizzleMigrationsDirectory(): string {
    if (process.env.APP_MODE === 'dev') {
        return join(__dirname, "..", "..", "drizzle")
    } else {
        return join(process.resourcesPath, "drizzle");
    }
}