import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  const TABLE_NAME = 'tags';
  // Deletes ALL existing entries
  await knex(TABLE_NAME).del();

  // Inserts seed entries
  await knex(TABLE_NAME).insert([
    { id: 1, name: "food", description: 'eat food' },
    { id: 2, name: "entertainment", description: '' },
    { id: 3, name: "commute", description: 'public transport and petrol' }
  ]);
};
