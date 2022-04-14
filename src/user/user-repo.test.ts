import knex from 'knex';
import config from '../db/knexfile';
import useRepo from './user-repo';

let testDB = knex(config.test);

beforeAll(async () => {
  await testDB.migrate.latest();
});

afterAll(() => {
  return testDB.destroy();
});

beforeEach(async () => {
  await testDB.seed.run();
})

describe('tests for db functions in user repo', () => {
  describe('getUserByID', () => {
    it('should return valid user info given valid user id', async () => {
      const id = '4ee085b7-4bf4-4a5a-8264-4f45eee16fff';
      const userBob = await useRepo.getUserByID(id, testDB);
      expect(userBob.name).toBe('Bob');
      expect(userBob.email).toBe('bob@myemail.com');
    })
  });
})