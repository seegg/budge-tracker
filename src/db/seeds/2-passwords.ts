import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('passwords').del();

  // Inserts seed entries
  //testpassword
  //password123
  await knex('passwords').insert([
    { user_id: 'cdd6c547-22f7-49fd-ae99-7f934d8c6484', salt: 'some salt', password_hash: '7669520ac3a38e3d3b3e079af6669dab4902d637b50a5afc5ec482f62ddba278ec979c2b18cc4fc4c757f14092519dac4e090c6775035ad03f53acae0442c716' },
    { user_id: '4ee085b7-4bf4-4a5a-8264-4f45eee16fff', salt: 'ec2760f9b46feffc83a48ae33db3366b', password_hash: '0e927460a9709056b0df5de49152572cc501d0aa9c87eabf227049d62f6c9bc1e672622d92d4fa7781c413236678b8456cc2c9da762fdb7bc0db6f5d9649167d' },
  ]);
};
