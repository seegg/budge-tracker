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
let auth: any;
let userServiceT: any;

beforeAll(async () => {
  await testDB.migrate.latest();
  await testDB.seed.run();
  //set up auth services with dependencies.
  const pwRepo = passwordRepo(testDB);
  const pwServices = passwordServices(pbkdf2Sync, randomBytes, pwRepo);
  const userRepoT = userRepo(testDB);
  userServiceT = userServices(userRepoT, pwServices, uuidv4);
  auth = authServices(jwt, pwServices, userServiceT, appConfig);
});

afterAll(() => {
  return testDB.destroy();
});

describe('tests for auth service functions', () => {
  describe('verifyByEmail', () => {
    it('should return an access token given correct email and password', async () => {
      try {
        const jwtSecret = appConfig.jwtKey;
        const email = 'bob@myemail.com';
        const password = 'password123';
        const token = await auth.verifyByEmail(email, password);
        expect((jwt.verify(token as string, jwtSecret) as User).email).toBe(email);
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    it('should return null given incorrect login details', async () => {
      const email = 'incorrect@myemail.com';
      const password = 'somewrongpassword';
      const token = await auth.verifyByEmail(email, password);
      expect(token).toBeNull();
    });
  });

  describe('generateAccessToken', () => {
    it('should generate a jwt given payload', () => {
      const user: User = { id: 'userid12345', name: 'test123', email: 'testuser@test.com', verified: false };
      const token = auth.generateAccessToken(user);
      expect(token).toBeTruthy();
    });
  });

  describe('registerUser', () => {
    it('should register a new user to the database given valid input', async () => {
      const user = { name: 'test3', email: 'test3@test3.com', password: 'test3password' };
      const newUser = await auth.registerUser(user);
      const checkUser = await userServiceT.getUserByEmail(newUser.email);
      expect(checkUser.name).toBe(user.name);
    })
  })
})