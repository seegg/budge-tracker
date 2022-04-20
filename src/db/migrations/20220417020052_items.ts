import { Knex } from "knex";

/**
 * @param {import('knex')} knex 
 */
export const up = async (knex: Knex) => {
  await knex.schema.createTable('items', (table) => {
    table.increments('id');
    table.string('user_id')
      .references('users.id')
      .onDelete('CASCADE');
    table.string('tag_id')
      .references('tags.id')
      .onDelete('SET NULL');
    table.string('name');
    table.string('description');
    table.integer('price').notNullable();
    table.integer('purchase_date').notNullable();
  })
};

/**
 * @param {import('knex')} knex 
 */
export const down = async (knex: Knex) => {
  await knex.schema.dropTable('items');
};