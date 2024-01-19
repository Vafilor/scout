CREATE TABLE `image_cache` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`last_modified_time_ms` integer NOT NULL,
	`cache_path` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `image_cache_key_unique` ON `image_cache` (`key`);--> statement-breakpoint
CREATE INDEX `key_index` ON `image_cache` (`key`);