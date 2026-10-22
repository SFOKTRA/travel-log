CREATE TABLE `location` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`slug` text NOT NULL UNIQUE,
	`description` text,
	`lat` real NOT NULL,
	`long` real NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `locationLog` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text NOT NULL,
	`description` text,
	`startedAt` integer NOT NULL,
	`endedAt` integer NOT NULL,
	`lat` real NOT NULL,
	`long` real NOT NULL,
	`locationId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	CONSTRAINT `fk_locationLog_locationId_location_id_fk` FOREIGN KEY (`locationId`) REFERENCES `location`(`id`)
);
--> statement-breakpoint
CREATE TABLE `locationLogImage` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`key` text NOT NULL,
	`locationId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	CONSTRAINT `fk_locationLogImage_locationId_location_id_fk` FOREIGN KEY (`locationId`) REFERENCES `location`(`id`)
);
