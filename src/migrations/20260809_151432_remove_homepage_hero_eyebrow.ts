import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "_homepage_v" DROP COLUMN "version_hero_eyebrow";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage" ADD COLUMN "hero_eyebrow" varchar;
  ALTER TABLE "_homepage_v" ADD COLUMN "version_hero_eyebrow" varchar;`)
}
