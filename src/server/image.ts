import { extname } from "node:path";

import convert from "heic-convert";
import sharp from "sharp";

import { readFile, writeFile } from "node:fs/promises";

export async function createIcon(inputPath: string, outputPath: string, width: number, height: number): Promise<void> {
    const ext = extname(inputPath).toLowerCase();

    if (ext === ".heic") {
        const inputBuffer = await readFile(inputPath);
        const outputBuffer = await convert({
            buffer: inputBuffer,
            format: 'JPEG',
            quality: 1
        });

        await writeFile(outputPath, Buffer.from(outputBuffer));
    } else {
        await sharp(inputPath).resize(width, height).jpeg().toFile(outputPath);
    }
}