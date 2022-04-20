import { Knex } from "knex";

/**
 * @param {import('knex')} knex 
 */
export const up = async (knex: Knex) => {
  await knex.schema.createTable('tags', (table) => {
    table.increments('id');
    table.string('name').unique();
    table.string('description');
  })
};

/**
 * @param {import('knex')} knex 
 */
export const down = async (knex: Knex) => {
  await knex.schema.dropTable('tags');
};