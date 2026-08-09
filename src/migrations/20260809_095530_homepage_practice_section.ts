import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "homepage_practice_disciplines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description_primary" varchar,
  	"description_secondary" varchar
  );
  
  CREATE TABLE "_homepage_v_version_practice_disciplines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description_primary" varchar,
  	"description_secondary" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "homepage" ADD COLUMN "practice_image_id" integer;
  ALTER TABLE "homepage" ADD COLUMN "practice_heading_line_one" varchar DEFAULT 'Architecture is a frame';
  ALTER TABLE "homepage" ADD COLUMN "practice_heading_line_two_prefix" varchar DEFAULT 'for';
  ALTER TABLE "homepage" ADD COLUMN "practice_heading_line_two_emphasis" varchar DEFAULT 'ordinary life.';
  ALTER TABLE "homepage" ADD COLUMN "practice_description_primary" varchar DEFAULT 'A connected practice across buildings, interiors, and landscapes.';
  ALTER TABLE "homepage" ADD COLUMN "practice_description_secondary" varchar DEFAULT 'Each is shaped around how places are actually lived in.';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_practice_image_id" integer;
  ALTER TABLE "_homepage_v" ADD COLUMN "version_practice_heading_line_one" varchar DEFAULT 'Architecture is a frame';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_practice_heading_line_two_prefix" varchar DEFAULT 'for';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_practice_heading_line_two_emphasis" varchar DEFAULT 'ordinary life.';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_practice_description_primary" varchar DEFAULT 'A connected practice across buildings, interiors, and landscapes.';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_practice_description_secondary" varchar DEFAULT 'Each is shaped around how places are actually lived in.';
  ALTER TABLE "homepage_practice_disciplines" ADD CONSTRAINT "homepage_practice_disciplines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_practice_disciplines" ADD CONSTRAINT "_homepage_v_version_practice_disciplines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "homepage_practice_disciplines_order_idx" ON "homepage_practice_disciplines" USING btree ("_order");
  CREATE INDEX "homepage_practice_disciplines_parent_id_idx" ON "homepage_practice_disciplines" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_practice_disciplines_order_idx" ON "_homepage_v_version_practice_disciplines" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_practice_disciplines_parent_id_idx" ON "_homepage_v_version_practice_disciplines" USING btree ("_parent_id");
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_practice_image_id_media_id_fk" FOREIGN KEY ("practice_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_practice_image_id_media_id_fk" FOREIGN KEY ("version_practice_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "homepage_practice_practice_image_idx" ON "homepage" USING btree ("practice_image_id");
  CREATE INDEX "_homepage_v_version_practice_version_practice_image_idx" ON "_homepage_v" USING btree ("version_practice_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage_practice_disciplines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_version_practice_disciplines" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "homepage_practice_disciplines" CASCADE;
  DROP TABLE "_homepage_v_version_practice_disciplines" CASCADE;
  ALTER TABLE "homepage" DROP CONSTRAINT "homepage_practice_image_id_media_id_fk";
  
  ALTER TABLE "_homepage_v" DROP CONSTRAINT "_homepage_v_version_practice_image_id_media_id_fk";
  
  DROP INDEX "homepage_practice_practice_image_idx";
  DROP INDEX "_homepage_v_version_practice_version_practice_image_idx";
  ALTER TABLE "homepage" DROP COLUMN "practice_image_id";
  ALTER TABLE "homepage" DROP COLUMN "practice_heading_line_one";
  ALTER TABLE "homepage" DROP COLUMN "practice_heading_line_two_prefix";
  ALTER TABLE "homepage" DROP COLUMN "practice_heading_line_two_emphasis";
  ALTER TABLE "homepage" DROP COLUMN "practice_description_primary";
  ALTER TABLE "homepage" DROP COLUMN "practice_description_secondary";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_practice_image_id";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_practice_heading_line_one";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_practice_heading_line_two_prefix";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_practice_heading_line_two_emphasis";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_practice_description_primary";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_practice_description_secondary";`)
}
