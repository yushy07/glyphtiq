CREATE TABLE "events" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" varchar(32) NOT NULL,
	"style_id" varchar(64) DEFAULT '' NOT NULL,
	"app_slug" varchar(40) DEFAULT '' NOT NULL,
	"day" varchar(10) NOT NULL,
	"count" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shares" (
	"id" varchar(16) PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"style_id" varchar(64) DEFAULT 'none' NOT NULL,
	"app_slug" varchar(40) DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX "events_type_style_day_idx" ON "events" USING btree ("type","style_id","app_slug","day");--> statement-breakpoint
CREATE INDEX "events_app_slug_idx" ON "events" USING btree ("app_slug");--> statement-breakpoint
CREATE INDEX "shares_created_at_idx" ON "shares" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "shares_expires_at_idx" ON "shares" USING btree ("expires_at");