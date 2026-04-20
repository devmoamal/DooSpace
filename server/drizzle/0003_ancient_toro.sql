CREATE TABLE "loops" (
	"id" text PRIMARY KEY NOT NULL,
	"doo_id" integer NOT NULL,
	"type" text NOT NULL,
	"interval_ms" integer,
	"cron_expr" text,
	"payload" jsonb,
	"target_path" text NOT NULL,
	"end_expression" text,
	"status" text DEFAULT 'active' NOT NULL,
	"last_run_at" timestamp,
	"next_run_at" timestamp,
	"retries" integer DEFAULT 0 NOT NULL,
	"max_retries" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "doobox" ALTER COLUMN "value" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "loops" ADD CONSTRAINT "loops_doo_id_doos_id_fk" FOREIGN KEY ("doo_id") REFERENCES "public"."doos"("id") ON DELETE cascade ON UPDATE no action;