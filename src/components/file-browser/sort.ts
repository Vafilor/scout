import { AppFile } from "app/types/filesystem";

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

export type AppFileComparator = (lhs: AppFile, rhs: AppFile) => number;

export interface SortOptions {
    column: SortableFileColumn;
    direction: "asc" | "desc";
}

export function sortFileByName(lhs: AppFile, rhs: AppFile): number {
    return lhs.name.localeCompare(rhs.name);
}

export function sortFileByCanonicalName(lhs: AppFile, rhs: AppFile): number {
    return lhs.name.toLocaleLowerCase().localeCompare(rhs.name.toLocaleLowerCase());
}

export function sortByPath(lhs: AppFile, rhs: AppFile): number {
    return lhs.path.toLocaleLowerCase().localeCompare(rhs.path.toLocaleLowerCase());
}

export function getSortForAppFiles(column: SortableFileColumn): AppFileComparator {
    switch (column) {
        case SortableFileColumn.Name:
            return sortFileByName;
        case SortableFileColumn.CanonicalName:
            return sortFileByCanonicalName;
        case SortableFileColumn.Path:
            return sortByPath;
        default:
            throw new Error(`Sort for column ${column} is not supported`);
    }
}