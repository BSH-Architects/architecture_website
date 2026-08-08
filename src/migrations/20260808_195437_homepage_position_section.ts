import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage" ADD COLUMN "position_image_id" integer;
  ALTER TABLE "homepage" ADD COLUMN "position_heading" varchar DEFAULT E'Architecture begins with what\\nis already there and makes room\\nfor what comes next.';
  ALTER TABLE "homepage" ADD COLUMN "position_description_primary" varchar DEFAULT 'We start with climate, terrain, movement, views, and the routines that give a place its character.';
  ALTER TABLE "homepage" ADD COLUMN "position_description_secondary" varchar DEFAULT 'Plans are reduced until structure, material, and daily use read as one clear idea. The result is quiet by design: spaces shaped by proportion, daylight, and the way they are lived in.';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_position_image_id" integer;
  ALTER TABLE "_homepage_v" ADD COLUMN "version_position_heading" varchar DEFAULT E'Architecture begins with what\\nis already there and makes room\\nfor what comes next.';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_position_description_primary" varchar DEFAULT 'We start with climate, terrain, movement, views, and the routines that give a place its character.';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_position_description_secondary" varchar DEFAULT 'Plans are reduced until structure, material, and daily use read as one clear idea. The result is quiet by design: spaces shaped by proportion, daylight, and the way they are lived in.';
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_position_image_id_media_id_fk" FOREIGN KEY ("position_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_position_image_id_media_id_fk" FOREIGN KEY ("version_position_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "homepage_position_position_image_idx" ON "homepage" USING btree ("position_image_id");
  CREATE INDEX "_homepage_v_version_position_version_position_image_idx" ON "_homepage_v" USING btree ("version_position_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage" DROP CONSTRAINT "homepage_position_image_id_media_id_fk";
  
  ALTER TABLE "_homepage_v" DROP CONSTRAINT "_homepage_v_version_position_image_id_media_id_fk";
  
  DROP INDEX "homepage_position_position_image_idx";
  DROP INDEX "_homepage_v_version_position_version_position_image_idx";
  ALTER TABLE "homepage" DROP COLUMN "position_image_id";
  ALTER TABLE "homepage" DROP COLUMN "position_heading";
  ALTER TABLE "homepage" DROP COLUMN "position_description_primary";
  ALTER TABLE "homepage" DROP COLUMN "position_description_secondary";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_position_image_id";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_position_heading";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_position_description_primary";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_position_description_secondary";`)
}
