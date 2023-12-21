import { access, constants } from "node:fs/promises";

export async function fileExists(path: string): Promise<boolean> {
    try {
        await access(path, constants.F_OK);
        return true;
    } catch (e: unknown) {
        return false;
    }
}