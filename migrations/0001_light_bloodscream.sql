ALTER TABLE `users` ADD `apple_user_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_apple_user_id_unique` ON `users` (`apple_user_id`);