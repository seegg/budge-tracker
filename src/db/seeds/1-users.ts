import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    { id: 'cdd6c547-22f7-49fd-ae99-7f934d8c6484', name: 'Yuan', email: 'email@myemail.com', verified: true },
    { id: '4ee085b7-4bf4-4a5a-8264-4f45eee16fff', name: 'Bob', email: 'bob@myemail.com', verified: true },
    { id: '4omshi7-4tf4-4a5a-8264-4somerand6fff', name: 'Test User', email: 'testuser@myemail.com', verified: false },
  ]);
};