import * as migration_20260808_180411_initial_cms_schema from './20260808_180411_initial_cms_schema';
import * as migration_20260808_195437_homepage_position_section from './20260808_195437_homepage_position_section';
import * as migration_20260809_083310_homepage_people_section from './20260809_083310_homepage_people_section';
import * as migration_20260809_093856_homepage_closing_section from './20260809_093856_homepage_closing_section';
import * as migration_20260809_095530_homepage_practice_section from './20260809_095530_homepage_practice_section';
import * as migration_20260809_151432_remove_homepage_hero_eyebrow from './20260809_151432_remove_homepage_hero_eyebrow';
import * as migration_20260809_155027_add_homepage_hero_practice_descriptor from './20260809_155027_add_homepage_hero_practice_descriptor';

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
    name: '20260809_093856_homepage_closing_section',
  },
  {
    up: migration_20260809_095530_homepage_practice_section.up,
    down: migration_20260809_095530_homepage_practice_section.down,
    name: '20260809_095530_homepage_practice_section',
  },
  {
    up: migration_20260809_151432_remove_homepage_hero_eyebrow.up,
    down: migration_20260809_151432_remove_homepage_hero_eyebrow.down,
    name: '20260809_151432_remove_homepage_hero_eyebrow',
  },
  {
    up: migration_20260809_155027_add_homepage_hero_practice_descriptor.up,
    down: migration_20260809_155027_add_homepage_hero_practice_descriptor.down,
    name: '20260809_155027_add_homepage_hero_practice_descriptor'
  },
];
