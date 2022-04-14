import { authServices } from "./auth-services";
import knex from 'knex';
import config from '../db/knexfile';
import appConfig from '../config';
import { passwordRepo } from './password/password-repo';
import { passwordServices } from './password/password-services';
import jwt from 'jsonwebtoken';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { userRepo } from '../user/user-repo';
import { userServices } from '../user/user-services';
import { User } from "../user";

let testDB = knex(config.test);

beforeAll(async () => {
  await testDB.migrate.latest();
  await testDB.seed.run();
});

afterAll(() => {
  return testDB.destroy();
});

describe('tests for auth service functions', () => {
  describe('verifyByEmail', () => {
    it('should return an access token given correct email and password', async () => {
      const pwRepo = passwordRepo(testDB);
      const pwServices = passwordServices(pbkdf2Sync, randomBytes, pwRepo);
      const userRepoT = userRepo(testDB);
      const userServiceT = userServices(userRepoT, pwServices, uuidv4);
      const auth = authServices(jwt, pwServices, userServiceT, appConfig);
      try {
        const jwtSecret = appConfig.jwtKey;
        const email = 'bob@myemail.com';
        const password = 'password123';
        const token = await auth.verifyByEmail(email, password);
        expect((jwt.verify(token as string, jwtSecret) as User).email).toBe(email);
      } catch (err) {
        expect(err).toBeFalsy();
      }
    })
  });
})