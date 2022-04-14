import jsonwebtoken from 'jsonwebtoken';
import { User } from '../user/user-types';
import config from '../config';
import { AppError } from '../error';
import { passwordServices as pwServicesModule } from './password';
import { userServices as userServicesModuel } from '../user';

export const authServices = (jwt = jsonwebtoken,
  passwordServices = pwServicesModule,
  userServices = userServicesModuel,
  appConfig = config) => {

  const generateAccessToken = (user: User, expiresIn: number = 86400) => {
    try {
      const { jwtKey } = appConfig;
      return jwt.sign(user, jwtKey, { expiresIn });
    } catch (err) {
      throw new AppError('auth services', 500, 'error generating access token', true);
    }
  };

  /**
   * parse and return the payload in a jwt as plain text.
   */
  const parseAccessToken = (token: string) => {
    try {
      const { jwtKey } = appConfig;
      return jwt.verify(token, jwtKey);
    } catch (err) {
      if (err instanceof AppError && err.isOperational) throw err;
      throw new AppError('parse token', 403, 'unable to verify access token', true);
    }
  };

  /**
   * Generate and return an access token if credentials are correct.
   */
  const verifyByEmail = async (email: string, password: string) => {
    try {
      //if email and password is verified, generate access token from userinfo.
      const isVerified = await passwordServices.verifyUserPasswordByEmail(email, password);
      if (isVerified) {
        const user = await userServices.getUserByEmail(email);
        return generateAccessToken(user);
      } else {
        throw new AppError('login', 401, 'wrong username or password', true);
      };
    } catch (err) {
      if (err instanceof AppError && err.isOperational) throw err;
      throw new AppError('login', 500, 'error while processing credentials', true);
    }
  };

  const registerUser = async ({ name, email, password }: { email: string, name: string, password: string }) => {
    try {
      const user = await userServices.addUser({ name, password, email });
      return user;
    } catch (err) {
      if (err instanceof AppError && err.isOperational) throw err;
      throw new AppError('register', 500, 'error creating new user', true);
    }
  };

  return {
    generateAccessToken,
    parseAccessToken,
    verifyByEmail,
    registerUser
  };
};

export default authServices();