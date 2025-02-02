CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`profile_image` text,
	`bio` text,
	`role` text DEFAULT 'user' NOT NULL,
	`rating` real DEFAULT 0,
	`premium` integer DEFAULT false,
	`godmode` integer DEFAULT false,
	`followers` integer DEFAULT 0,
	`following` integer DEFAULT 0,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `follows` (
	`following_user_id` integer NOT NULL,
	`followed_user_id` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`following_user_id`, `followed_user_id`),
	FOREIGN KEY (`following_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`followed_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`language` text DEFAULT 'en',
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_user_id_unique` ON `settings` (`user_id`);--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`user_id` integer NOT NULL,
	`type_id` integer,
	`preparation_time` integer,
	`cooking_time` integer,
	`difficulty_level` text,
	`servings` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`thumbnail_image_id` integer,
	`search_vector` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`type_id`) REFERENCES `recipe_types`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`thumbnail_image_id`) REFERENCES `recipe_images`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `user_status_idx` ON `recipes` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `type_status_idx` ON `recipes` (`type_id`,`status`);--> statement-breakpoint
CREATE INDEX `difficulty_status_idx` ON `recipes` (`difficulty_level`,`status`);--> statement-breakpoint
CREATE INDEX `search_vector_idx` ON `recipes` (`search_vector`);--> statement-breakpoint
CREATE TABLE `recipe_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recipe_types_slug_unique` ON `recipe_types` (`slug`);--> statement-breakpoint
CREATE TABLE `recipe_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_id` integer,
	`url` text NOT NULL,
	`storage_key` text NOT NULL,
	`alt_text` text,
	`position` integer DEFAULT 0,
	`width` integer,
	`height` integer,
	`size` integer,
	`mime_type` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ai_features` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`prompt_template` text NOT NULL,
	`is_premium` integer DEFAULT false,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ai_conversations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`feature_id` integer NOT NULL,
	`recipe_id` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`feature_id`) REFERENCES `ai_features`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `ai_conv_user_created_at_idx` ON `ai_conversations` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `ai_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`conversation_id` integer NOT NULL,
	`is_user` integer NOT NULL,
	`content` text NOT NULL,
	`metadata` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `ai_conversations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `conversation_created_at_idx` ON `ai_messages` (`conversation_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `recipe_stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_id` integer NOT NULL,
	`views_count` integer DEFAULT 0 NOT NULL,
	`saves_count` integer DEFAULT 0 NOT NULL,
	`likes_count` integer DEFAULT 0 NOT NULL,
	`comments_count` integer DEFAULT 0 NOT NULL,
	`average_rating` real DEFAULT 0 NOT NULL,
	`total_cooking_time` integer,
	`ingredients_count` integer DEFAULT 0 NOT NULL,
	`last_interaction_at` integer,
	`popularity_score` real DEFAULT 0 NOT NULL,
	`trending_score` real DEFAULT 0 NOT NULL,
	`recent_views_24h` integer DEFAULT 0 NOT NULL,
	`recent_saves_24h` integer DEFAULT 0 NOT NULL,
	`recent_likes_24h` integer DEFAULT 0 NOT NULL,
	`recent_comments_24h` integer DEFAULT 0 NOT NULL,
	`recent_ratings_24h` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recipe_stats_recipe_id_unique` ON `recipe_stats` (`recipe_id`);--> statement-breakpoint
CREATE INDEX `popularity_score_idx` ON `recipe_stats` (`popularity_score`);--> statement-breakpoint
CREATE INDEX `trending_score_idx` ON `recipe_stats` (`trending_score`);--> statement-breakpoint
CREATE INDEX `views_count_idx` ON `recipe_stats` (`views_count`);--> statement-breakpoint
CREATE INDEX `likes_count_idx` ON `recipe_stats` (`likes_count`);--> statement-breakpoint
CREATE INDEX `average_rating_idx` ON `recipe_stats` (`average_rating`);--> statement-breakpoint
CREATE INDEX `last_interaction_at_idx` ON `recipe_stats` (`last_interaction_at`);--> statement-breakpoint
CREATE INDEX `recent_activity_idx` ON `recipe_stats` (`recent_views_24h`,`recent_saves_24h`,`recent_comments_24h`,`recent_likes_24h`);--> statement-breakpoint
CREATE TABLE `recipe_trending_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipe_id` integer NOT NULL,
	`trending_score` real NOT NULL,
	`views_count` integer NOT NULL,
	`saves_count` integer NOT NULL,
	`comments_count` integer NOT NULL,
	`ratings_count` integer NOT NULL,
	`period_start` integer NOT NULL,
	`period_end` integer NOT NULL,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `recipe_period_idx` ON `recipe_trending_history` (`recipe_id`,`period_start`);--> statement-breakpoint
CREATE INDEX `period_trending_idx` ON `recipe_trending_history` (`period_start`,`trending_score`);--> statement-breakpoint
CREATE TABLE `user_interactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`recipe_id` integer NOT NULL,
	`interaction_type` text NOT NULL,
	`duration_seconds` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `user_recipe_idx` ON `user_interactions` (`user_id`,`recipe_id`);--> statement-breakpoint
CREATE INDEX `user_type_idx` ON `user_interactions` (`user_id`,`interaction_type`);--> statement-breakpoint
CREATE INDEX `recipe_type_idx` ON `user_interactions` (`recipe_id`,`interaction_type`);--> statement-breakpoint
CREATE TABLE `likes` (
	`id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`likeable_type` text NOT NULL,
	`likeable_id` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`user_id`, `likeable_type`, `likeable_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `likeable_idx` ON `likes` (`likeable_type`,`likeable_id`);