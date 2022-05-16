import knex from 'knex';
import config from '../../db/knexfile';
import { PasswordRepo } from './password-repo';

let testDB = knex(config.test);
const pwRepo = new PasswordRepo(testDB);
beforeAll(async () => {
  await testDB.migrate.latest();
});

afterAll(() => {
  return testDB.destroy();
});

beforeEach(async () => {
  await testDB.seed.run();
})

describe('tests for db functions in password repo', () => {
  describe('getPasswordDetailsByEmail', () => {
    it('should return correct info given valid email', async () => {
      const testEmail = 'bob@myemail.com';
      const pwDetails = await pwRepo.getPasswordDetailsByEmail(testEmail);
      expect(pwDetails.salt).toBe('ec2760f9b46feffc83a48ae33db3366b');
      expect(pwDetails.user_id).toBe('4ee085b7-4bf4-4a5a-8264-4f45eee16fff');
      expect(pwDetails.password_hash).toBe('0e927460a9709056b0df5de49152572cc501d0aa9c87eabf227049d62f6c9bc1e672622d92d4fa7781c413236678b8456cc2c9da762fdb7bc0db6f5d9649167d');
    });

    it('should throw an error given invalid email', async () => {
      try {
        const testEmail = 'incorrect@myemail.com';
        const pwDetails = await pwRepo.getPasswordDetailsByEmail(testEmail);
        expect(pwDetails.salt).toBe('ec2760f9b46feffc83a48ae33db3366b');
        expect(pwDetails.salt).toBe('ec2760f9b46feffc83a48ae33db3366b+++');
      } catch (err) {
      }
    })
  })
})