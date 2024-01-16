import { extname } from "node:path";

import sharp from "sharp";
import decode from 'heic-decode';

import { readFile } from "node:fs/promises";
import FfmpegUtils from "./ffmpeg-utils";

interface IconArgument {
    inputPath: string;
    outputPath: string;
    width: number;
    height: number;
}

async function createHeicIcon({ inputPath, outputPath, width, height }: IconArgument) {
    const inputBuffer = await readFile(inputPath);
    const { data, width: imageWidth, height: imageHeight } = await decode({ buffer: inputBuffer });

    // data is returned as type ImageData, which has 4 channels RGBA
    // https://github.com/catdad-experiments/heic-decode 
    // "When the images are decoded, the return value is a plain object in the format of ImageData"
    // https://developer.mozilla.org/en-US/docs/Web/API/ImageData/data
    await sharp(data, {
        raw: { width: imageWidth, height: imageHeight, channels: 4 }
    }).resize(width, height).jpeg().toFile(outputPath);
}


async function createVideoIcon({ inputPath, outputPath, width, height }: IconArgument) {
    await FfmpegUtils.instance.extractFrame({
        inputPath: inputPath,
        outputPath: outputPath,
        offsetMs: 1000,
        width,
        height
    });
}

export async function createIcon(args: IconArgument): Promise<void> {
    const { inputPath, outputPath, width, height } = args;

    const ext = extname(inputPath).toLowerCase();

    if (ext === ".heic") {
        await createHeicIcon(args);
    } else if (ext === ".mov" || ext === ".webm") {
        await createVideoIcon(args);
    } else {
        await sharp(inputPath).resize(width, height).jpeg().toFile(outputPath);
    }
}