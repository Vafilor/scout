import { text, integer, sqliteTable, index } from "drizzle-orm/sqlite-core";

export enum FileState {
    ToBeDeleted = 1
}

export enum FileType {
    File = 1,
    Directory = 2
}

export const files = sqliteTable('files', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    canonicalName: text('canonical_name').notNull(),
    path: text('path').notNull().unique(),
    parentPath: text('parent_path'),
    createdAt: integer('created_at').notNull(), // When this record was created
    type: integer('type').notNull(), // FileType
    size: integer('size'), // For directories, this is the total, recursive, file size. Null by default.
    lastAccessTimeMs: integer('last_access_time_ms').notNull(),
    lastModifiedTimeMs: integer('last_modified_time_ms').notNull(),
    lastFileStatusChangeTimeMs: integer('last_file_status_change_time_ms').notNull(),
    createdAtTimeMs: integer('created_at_time_ms').notNull(),
    state: integer('state') // FileState,

}, (table) => ({
    pathIndex: index("path_index").on(table.path),
    parentPathIndex: index("parent_path_index").on(table.parentPath)
}));

export type File = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;