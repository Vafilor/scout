CREATE TABLE `files` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`canonical_name` text NOT NULL,
	`path` text NOT NULL,
	`parent_path` text,
	`created_at` integer NOT NULL,
	`type` integer NOT NULL,
	`size` integer,
	`last_access_time_ms` integer NOT NULL,
	`last_modified_time_ms` integer NOT NULL,
	`last_file_status_change_time_ms` integer NOT NULL,
	`created_at_time_ms` integer NOT NULL,
	`state` integer
);
--> statement-breakpoint
CREATE TABLE `image_cache` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`last_modified_time_ms` integer NOT NULL,
	`cache_path` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `files_path_unique` ON `files` (`path`);--> statement-breakpoint
CREATE INDEX `path_index` ON `files` (`path`);--> statement-breakpoint
CREATE INDEX `parent_path_index` ON `files` (`parent_path`);--> statement-breakpoint

CREATE UNIQUE INDEX `image_cache_key_unique` ON `image_cache` (`key`);--> statement-breakpoint
CREATE INDEX `key_index` ON `image_cache` (`key`);