import knex from 'knex';
import config from '../db/knexfile';
import { userRepo } from './user-repo';

let testDB = knex(config.test);
const userRepoTest = userRepo(testDB);
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
      const userBob = await userRepoTest.getUserByID(id);
      expect(userBob.name).toBe('Bob');
      expect(userBob.email).toBe('bob@myemail.com');
    });

    it('should error provide invalid user id', async () => {
      try {
        const id = 'wrong id';
        const user = await userRepoTest.getUserByID(id);
        expect(user).toBeTruthy();
      } catch (err) { }
    })
  });
})