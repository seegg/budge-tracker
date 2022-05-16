import { AuthServices } from "./auth-services";
import knex from 'knex';
import config from '../db/knexfile';
import appConfig from '../config';
import { PasswordRepo } from './password/password-repo';
import { PasswordServices } from './password/password-services';
import jwt from 'jsonwebtoken';
import { UserRepo } from '../user/user-repo';
import { UserServices } from '../user';
import { User } from "../user";

let testDB = knex(config.test);
let auth: any;
let userService: any;

beforeAll(async () => {
  await testDB.migrate.latest();
  await testDB.seed.run();
  //set up auth services with dependencies.
  const pwRepo = new PasswordRepo(testDB);
  const pwServices = new PasswordServices(pwRepo);
  const userRepoT = new UserRepo(testDB);
  userService = new UserServices(userRepoT, pwServices);
  auth = new AuthServices(userService, pwServices);
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
      const checkUser = await userService.getUserByEmail(newUser.email);
      expect(checkUser.name).toBe(user.name);
    })
  })
})