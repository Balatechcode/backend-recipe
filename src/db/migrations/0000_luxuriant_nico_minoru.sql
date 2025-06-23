CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"recip_id" text NOT NULL,
	"title" text NOT NULL,
	"image" text NOT NULL,
	"cook_time" text NOT NULL,
	"servings" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
