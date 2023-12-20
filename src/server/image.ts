import { extname } from "node:path";

import sharp from "sharp";
import decode from 'heic-decode';

import { readFile } from "node:fs/promises";

export async function createIcon(inputPath: string, outputPath: string, width: number, height: number): Promise<void> {
    const ext = extname(inputPath).toLowerCase();

    if (ext === ".heic") {
        const inputBuffer = await readFile(inputPath);
        const { data, width: imageWidth, height: imageHeight } = await decode({ buffer: inputBuffer });

        // TODO 4 is a guess - need to validate
        await sharp(data, { raw: { width: imageWidth, height: imageHeight, channels: 4 } }).resize(width, height).jpeg().toFile(outputPath);
    } else {
        await sharp(inputPath).resize(width, height).jpeg().toFile(outputPath);
    }
}