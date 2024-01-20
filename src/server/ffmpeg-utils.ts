// eslint-disable-next-line import/no-named-as-default
import FfmpegCommand from "fluent-ffmpeg";
import { join, basename } from "node:path";

interface ExtractImageArgs {
    inputPath: string;
    outputPath: string;
    offsetMs: number;
    width: number;
    height: number;
}

export default class FfmpegUtils {
    constructor(private readonly ffmpegPath: string) {
    }

    extractFrame({ inputPath, outputPath, offsetMs, width, height }: ExtractImageArgs): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const command = FfmpegCommand({ source: inputPath });
            command.setFfmpegPath(this.ffmpegPath)
                .on('error', (err) => reject(err))
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