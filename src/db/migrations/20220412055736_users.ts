import { Knex } from "knex";

/**
 * @param {import('knex')} knex 
 */
export const up = async (knex: Knex) => {
  return await knex.schema.createTable('users', table => {
    table.string('id').primary();
    table.string('name');
    table.string('email').unique();
    table.boolean('verified');
  })

};

/**
 * @param {import('knex')} knex 
 */
export const down = async (knex: Knex) => {
  return await knex.schema.dropTable('users');
};