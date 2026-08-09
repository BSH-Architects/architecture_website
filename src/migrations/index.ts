import * as migration_20260808_180411_initial_cms_schema from './20260808_180411_initial_cms_schema';
import * as migration_20260808_195437_homepage_position_section from './20260808_195437_homepage_position_section';
import * as migration_20260809_083310_homepage_people_section from './20260809_083310_homepage_people_section';
import * as migration_20260809_093856_homepage_closing_section from './20260809_093856_homepage_closing_section';

export const migrations = [
  {
    up: migration_20260808_180411_initial_cms_schema.up,
    down: migration_20260808_180411_initial_cms_schema.down,
    name: '20260808_180411_initial_cms_schema',
  },
  {
    up: migration_20260808_195437_homepage_position_section.up,
    down: migration_20260808_195437_homepage_position_section.down,
    name: '20260808_195437_homepage_position_section',
  },
  {
    up: migration_20260809_083310_homepage_people_section.up,
    down: migration_20260809_083310_homepage_people_section.down,
    name: '20260809_083310_homepage_people_section',
  },
  {
    up: migration_20260809_093856_homepage_closing_section.up,
    down: migration_20260809_093856_homepage_closing_section.down,
    name: '20260809_093856_homepage_closing_section'
  },
];
