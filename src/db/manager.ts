import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate as sqliteMigrate } from "drizzle-orm/better-sqlite3/migrator";
import SQLiteDatabase from 'better-sqlite3';
import FilesRepository from './files-repository';
import ImageCacheRepository from './image-cache-repository';
import { Constants } from 'app/configuration/constants';

export default class Manager {
    private db: BetterSQLite3Database<Record<string, never>>;
    private filesRepository: FilesRepository;
    private imageCacheRepository: ImageCacheRepository;

    constructor(path: string) {
        const sqlite = new SQLiteDatabase(path);
        this.db = drizzle(sqlite);

        this.filesRepository = new FilesRepository(this.db)
        this.imageCacheRepository = new ImageCacheRepository(this.db);
    }

    migrate(): void {
        sqliteMigrate(this.db, {
            migrationsFolder: Constants.instance.getDrizzleMigrationsDirectory()
        });
    }

    get files(): FilesRepository {
        return this.filesRepository;
    }

    get imageCache(): ImageCacheRepository {
        return this.imageCacheRepository;
    }
}