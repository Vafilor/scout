import { text, integer, sqliteTable, index } from "drizzle-orm/sqlite-core";

export const imageCache = sqliteTable('image_cache', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    key: text('key').notNull().unique(),
    lastModifiedTimeMs: integer('last_modified_time_ms').notNull(),
    cachePath: text('cache_path').notNull()

}, (table) => ({
    pathIndex: index("key_index").on(table.key)
}));

export type ImageCache = typeof imageCache.$inferSelect;
export type InsertImageCache = typeof imageCache.$inferInsert;