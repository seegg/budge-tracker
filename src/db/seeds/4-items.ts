import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  const TABLE_NAME = 'items';
  const bobID = '4ee085b7-4bf4-4a5a-8264-4f45eee16fff';
  // Deletes ALL existing entries
  await knex(TABLE_NAME).del();

  // Inserts seed entries
  await knex(TABLE_NAME).insert([
    { id: 1, user_id: bobID, tag_id: 1, name: 'pizza', description: '', purchase_date: 1650163345866, price: 2500 },
    { id: 2, user_id: bobID, tag_id: 3, name: 'petrol', description: '', purchase_date: 1650163345866, price: 5500 },
    { id: 3, user_id: bobID, tag_id: 1, name: '2kg ground beef', description: 'burgers', purchase_date: 1650163345866, price: 3000 },
  ]);
};
