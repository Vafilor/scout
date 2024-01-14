import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { File, FileState, files as schema } from "./schema/files";
import { and, asc, desc, eq, inArray, like } from "drizzle-orm";

export enum SortableFileColumn {
    Name,
    CanonicalName,
    Path,
    FileCreatedAt,
    FileModifiedAt,
    FileLastAccessedAt,
    Size,
    Type
}

export interface SortOptions {
    column: SortableFileColumn;
    direction: "asc" | "desc";
}

export interface ListFileOptions {
    sort?: SortOptions;
    limit?: number;
    offset?: number;
}

function sortableColumnToSchemaColumn(col: SortableFileColumn) {
    switch (col) {
        case SortableFileColumn.Name:
            return schema.name;
        case SortableFileColumn.CanonicalName:
            return schema.canonicalName;
        case SortableFileColumn.FileCreatedAt:
            return schema.createdAtTimeMs;
        case SortableFileColumn.FileModifiedAt:
            return schema.lastModifiedTimeMs;
        case SortableFileColumn.Path:
            return schema.path;
        case SortableFileColumn.FileLastAccessedAt:
            return schema.lastAccessTimeMs;
        case SortableFileColumn.Size:
            return schema.size;
        case SortableFileColumn.Type:
            return schema.type;
    }
}

export default class FilesRepository {
    constructor(private db: BetterSQLite3Database<Record<string, never>>) {
    }

    async all(): Promise<File[]> {
        return this.db.select().from(schema);
    }

    async findForPrefix(prefix: string): Promise<File[]> {
        return this.db.select().from(schema).where(like(schema.path, prefix + "%"));
    }

    async findForParentPath(parentPath: string, options?: ListFileOptions): Promise<File[]> {
        const query = this.db.select().from(schema).where(eq(schema.parentPath, parentPath));

        if (options?.sort) {
            const orderCol = sortableColumnToSchemaColumn(options.sort.column);
            const direction = options.sort.direction === "asc" ? asc(orderCol) : desc(orderCol);
            query.orderBy(direction);
        }

        if (options?.limit) {
            query.limit(options.limit);
        }

        if (options?.offset) {
            query.offset(options.offset);
        }

        return query;
    }

    async findForPaths(paths: string[]): Promise<File[]> {
        return this.db.select().from(schema).where(inArray(schema.path, paths));
    }

    async insert(file: Omit<File, "id">): Promise<void> {
        await this.db.insert(schema).values(file);
    }

    async updateForPath(path: string, file: Omit<File, "id" | "path">): Promise<void> {
        await this.db.update(schema).set({
            ...file,
            path
        }).where(eq(schema.path, path));
    }

    async updateStateForParentPath(parentPath: string, state: FileState | null) {
        await this.db.update(schema).set({
            state
        }).where(eq(schema.parentPath, parentPath));
    }

    async updateStateForPath(path: string, state: FileState | null) {
        await this.db.update(schema).set({
            state
        }).where(eq(schema.path, path));
    }

    async deleteToBeDeletedForParentPath(parentPath: string) {
        await this.db.delete(schema).where(
            and(
                eq(schema.parentPath, parentPath),
                eq(schema.state, FileState.ToBeDeleted)
            )
        );
    }
}