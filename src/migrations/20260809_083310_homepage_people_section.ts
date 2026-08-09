import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage" ADD COLUMN "people_section_label" varchar DEFAULT 'Studio / People';
  ALTER TABLE "homepage" ADD COLUMN "people_section_summary" varchar DEFAULT 'Two founders · One practice';
  ALTER TABLE "homepage" ADD COLUMN "people_heading" varchar DEFAULT 'The practice is a conversation.';
  ALTER TABLE "homepage" ADD COLUMN "people_description" varchar DEFAULT 'Two independent ways of seeing, held together by a shared commitment to clarity, material, and the life of each place.';
  ALTER TABLE "homepage" ADD COLUMN "people_person_one_image_id" integer;
  ALTER TABLE "homepage" ADD COLUMN "people_person_one_name" varchar DEFAULT 'Person one';
  ALTER TABLE "homepage" ADD COLUMN "people_person_one_role" varchar DEFAULT 'Co-founder';
  ALTER TABLE "homepage" ADD COLUMN "people_person_one_description" varchar DEFAULT 'Architecture / Design direction';
  ALTER TABLE "homepage" ADD COLUMN "people_person_two_image_id" integer;
  ALTER TABLE "homepage" ADD COLUMN "people_person_two_name" varchar DEFAULT 'Person two';
  ALTER TABLE "homepage" ADD COLUMN "people_person_two_role" varchar DEFAULT 'Co-founder';
  ALTER TABLE "homepage" ADD COLUMN "people_person_two_description" varchar DEFAULT 'Architecture / Practice direction';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_people_section_label" varchar DEFAULT 'Studio / People';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_people_section_summary" varchar DEFAULT 'Two founders · One practice';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_people_heading" varchar DEFAULT 'The practice is a conversation.';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_people_description" varchar DEFAULT 'Two independent ways of seeing, held together by a shared commitment to clarity, material, and the life of each place.';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_people_person_one_image_id" integer;
  ALTER TABLE "_homepage_v" ADD COLUMN "version_people_person_one_name" varchar DEFAULT 'Person one';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_people_person_one_role" varchar DEFAULT 'Co-founder';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_people_person_one_description" varchar DEFAULT 'Architecture / Design direction';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_people_person_two_image_id" integer;
  ALTER TABLE "_homepage_v" ADD COLUMN "version_people_person_two_name" varchar DEFAULT 'Person two';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_people_person_two_role" varchar DEFAULT 'Co-founder';
  ALTER TABLE "_homepage_v" ADD COLUMN "version_people_person_two_description" varchar DEFAULT 'Architecture / Practice direction';
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_people_person_one_image_id_media_id_fk" FOREIGN KEY ("people_person_one_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_people_person_two_image_id_media_id_fk" FOREIGN KEY ("people_person_two_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_people_person_one_image_id_media_id_fk" FOREIGN KEY ("version_people_person_one_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_people_person_two_image_id_media_id_fk" FOREIGN KEY ("version_people_person_two_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "homepage_people_person_one_people_person_one_image_idx" ON "homepage" USING btree ("people_person_one_image_id");
  CREATE INDEX "homepage_people_person_two_people_person_two_image_idx" ON "homepage" USING btree ("people_person_two_image_id");
  CREATE INDEX "_homepage_v_version_people_person_one_version_people_per_idx" ON "_homepage_v" USING btree ("version_people_person_one_image_id");
  CREATE INDEX "_homepage_v_version_people_person_two_version_people_per_idx" ON "_homepage_v" USING btree ("version_people_person_two_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage" DROP CONSTRAINT "homepage_people_person_one_image_id_media_id_fk";
  
  ALTER TABLE "homepage" DROP CONSTRAINT "homepage_people_person_two_image_id_media_id_fk";
  
  ALTER TABLE "_homepage_v" DROP CONSTRAINT "_homepage_v_version_people_person_one_image_id_media_id_fk";
  
  ALTER TABLE "_homepage_v" DROP CONSTRAINT "_homepage_v_version_people_person_two_image_id_media_id_fk";
  
  DROP INDEX "homepage_people_person_one_people_person_one_image_idx";
  DROP INDEX "homepage_people_person_two_people_person_two_image_idx";
  DROP INDEX "_homepage_v_version_people_person_one_version_people_per_idx";
  DROP INDEX "_homepage_v_version_people_person_two_version_people_per_idx";
  ALTER TABLE "homepage" DROP COLUMN "people_section_label";
  ALTER TABLE "homepage" DROP COLUMN "people_section_summary";
  ALTER TABLE "homepage" DROP COLUMN "people_heading";
  ALTER TABLE "homepage" DROP COLUMN "people_description";
  ALTER TABLE "homepage" DROP COLUMN "people_person_one_image_id";
  ALTER TABLE "homepage" DROP COLUMN "people_person_one_name";
  ALTER TABLE "homepage" DROP COLUMN "people_person_one_role";
  ALTER TABLE "homepage" DROP COLUMN "people_person_one_description";
  ALTER TABLE "homepage" DROP COLUMN "people_person_two_image_id";
  ALTER TABLE "homepage" DROP COLUMN "people_person_two_name";
  ALTER TABLE "homepage" DROP COLUMN "people_person_two_role";
  ALTER TABLE "homepage" DROP COLUMN "people_person_two_description";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_people_section_label";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_people_section_summary";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_people_heading";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_people_description";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_people_person_one_image_id";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_people_person_one_name";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_people_person_one_role";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_people_person_one_description";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_people_person_two_image_id";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_people_person_two_name";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_people_person_two_role";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_people_person_two_description";`)
}
