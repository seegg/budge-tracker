/**
 * @param {import('knex')} knex 
 */
export const up = async (knex) => {

  return await knex.schema.createTable('user', table => {
    table.string('id').primary();
    table.string('name');
    table.string('email').unique();
    table.boolean('verified');
  })

};

/**
 * @param {import('knex')} knex 
 */
export const down = async (knex) => {
  return await knex.schema.dropTable('user');
};