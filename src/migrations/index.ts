import * as migration_20260808_180411_initial_cms_schema from './20260808_180411_initial_cms_schema';

export const migrations = [
  {
    up: migration_20260808_180411_initial_cms_schema.up,
    down: migration_20260808_180411_initial_cms_schema.down,
    name: '20260808_180411_initial_cms_schema'
  },
];
