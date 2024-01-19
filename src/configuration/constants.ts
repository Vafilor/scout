import { join } from "node:path";

export enum ConfigurationNames {
    AppSettings = "configuration.json",
    ImageCache = "image_cache",
    FileDatabase = "file_database.db"
}

export function getFfmpegBinaryPath(): string {
    if (process.env.APP_MODE === 'dev') {
        const extension = process.platform === "win32" ? ".exe" : "";
        return join(__dirname, "ffmpeg" + extension);
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