// eslint-disable-next-line import/no-named-as-default
import FfmpegCommand, { setFfmpegPath } from "fluent-ffmpeg";
import { join, basename } from "node:path";

interface ExtractImageArgs {
    inputPath: string;
    outputPath: string;
    offsetMs: number;
    width: number;
    height: number;
}

export default class FfmpegUtils {
    private static _instance: FfmpegUtils | null = null;

    private constructor(ffmpegPath: string) {
        setFfmpegPath(ffmpegPath);
    }

    static init(ffmpegPath: string): FfmpegUtils {
        if (FfmpegUtils._instance === null) {
            FfmpegUtils._instance = new FfmpegUtils(ffmpegPath);
        }

        return FfmpegUtils._instance;
    }

    static get instance(): FfmpegUtils {
        if (!FfmpegUtils._instance) {
            throw new Error("FfmpegUtils has not been initialized. Call FfmpegUtils.init(...) first");
        }

        return FfmpegUtils._instance;
    }

    extractFrame({ inputPath, outputPath, offsetMs, width, height }: ExtractImageArgs): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const command = FfmpegCommand({ source: inputPath });
            command.on('error', (err) => reject(err))
                .on('end', () => resolve(outputPath))
                .takeScreenshots({
                    count: 1,
                    timestamps: [offsetMs / 1000],
                    size: `${width}x${height}`,
                    folder: join(outputPath, ".."),
                    filename: basename(outputPath)
                })
                .autoPad()
        });
    }
}