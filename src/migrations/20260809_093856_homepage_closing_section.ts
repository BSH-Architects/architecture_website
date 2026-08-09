import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage" ADD COLUMN "closing_image_id" integer;
  ALTER TABLE "homepage" ADD COLUMN "closing_heading" varchar DEFAULT E'Made to hold the\\nlife that follows.';
  ALTER TABLE "homepage" ADD COLUMN "closing_label" varchar DEFAULT 'Architecture / Interiors / Landscape';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_closing_image_id" integer;
  ALTER TABLE "_homepage_v" ADD COLUMN "version_closing_heading" varchar DEFAULT E'Made to hold the\\nlife that follows.';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_closing_label" varchar DEFAULT 'Architecture / Interiors / Landscape';
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_closing_image_id_media_id_fk" FOREIGN KEY ("closing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_closing_image_id_media_id_fk" FOREIGN KEY ("version_closing_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "homepage_closing_closing_image_idx" ON "homepage" USING btree ("closing_image_id");
  CREATE INDEX "_homepage_v_version_closing_version_closing_image_idx" ON "_homepage_v" USING btree ("version_closing_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage" DROP CONSTRAINT "homepage_closing_image_id_media_id_fk";
  
  ALTER TABLE "_homepage_v" DROP CONSTRAINT "_homepage_v_version_closing_image_id_media_id_fk";
  
  DROP INDEX "homepage_closing_closing_image_idx";
  DROP INDEX "_homepage_v_version_closing_version_closing_image_idx";
  ALTER TABLE "homepage" DROP COLUMN "closing_image_id";
  ALTER TABLE "homepage" DROP COLUMN "closing_heading";
  ALTER TABLE "homepage" DROP COLUMN "closing_label";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_closing_image_id";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_closing_heading";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_closing_label";`)
}
