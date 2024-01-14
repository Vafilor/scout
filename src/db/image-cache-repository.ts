import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { ImageCache, imageCache as schema } from "./schema/image-cache";
import { eq } from "drizzle-orm";

export default class ImageCacheRepository {
    constructor(private db: BetterSQLite3Database<Record<string, never>>) {
    }

    async findForKey(key: string): Promise<ImageCache | null> {
        const result = await this.db.select().from(schema).where(eq(schema.key, key));
        if (result.length === 0) {
            return null;
        }

        if (result.length !== 1) {
            throw new Error("More than one result found for ImageCache.findForKey");
        }

        return result[0];
    }

    async insert(record: Omit<ImageCache, "id">): Promise<void> {
        await this.db.insert(schema).values(record);
    }

    async updateForKey(key: string, update: Omit<ImageCache, "id" | "key">): Promise<void> {
        await this.db.update(schema).set({
            ...update
        });
    }
}