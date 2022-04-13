import { Knex } from "knex";

const TABLE_NAME = 'passwords';
/**
 * @param {import('knex')} knex 
 */
export const up = async (knex: Knex) => {
  await knex.schema.createTable(TABLE_NAME, (table) => {
    table.string('user_id').references('users.id').onDelete('CASCADE');
    table.string('password_hash');
    table.string('salt');
    table.primary(['user_id']);
  });
};

/**
 * @param {import('knex')} knex 
 */
export const down = async (knex: Knex) => {
  knex.schema.dropTable(TABLE_NAME);
};