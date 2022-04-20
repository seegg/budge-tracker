import { User } from "./user-types";
import { v4 as uuidv4 } from 'uuid';
import { AppError } from "../error";
import { PasswordServices, passwordServices } from "../auth/password";
import userDB from './user-repo';
import userRepo from "./user-repo";

export class UserServices {
  private userDAL;
  private passwordServices;
  private uuid;

  /**
   * Construct user services with dependencies.
   * @param userDAL User DB functions
   * @param passwordServices password services
   * @param uuid uuid generator;
   */
  constructor(userDAL = userDB, passwordServices: PasswordServices, uuid: () => string = uuidv4) {
    this.userDAL = userDAL;
    this.passwordServices = passwordServices;
    this.uuid = uuid;
  }

  /**
   * Add a new user given valid inputs
   * @param param0 {name, email, password}: { [key: string]: string }
   * @returns newly added user.
   */
  async addUser({ name, email, password }: { [key: string]: string }) {
    try {
      //check if email is already in use.
      if (await this.userDAL.getUserByEmail(email)) {
        throw new AppError('', 400, 'email already in use', true);
      }
      //generate a nuew uuid and construct user object.
      const id = this.uuid();
      const user: User = { id, name, email, verified: false };
      //salt and hash password
      const salt = await this.passwordServices.generateSalt();
      const passwordHash = await this.passwordServices.hashPassword(password, salt);
      //add new user to db.
      await this.userDAL.insertUser(user, passwordHash, salt);
      return user;
    } catch (err) {
      if (err instanceof AppError && err.isOperational) throw err;
      throw new AppError('addUser', 500, 'error adding user', true);
    }
  }

  /**
   * Delete a user
   * @param user user object
   * @returns true or false depending on success
   */
  async deleteUser(user: User) {
    try {
      let result = 0;
      if (user.id) {
        result = await this.userDAL.deleteUserByID(user.id);
      } else {
        result = await this.userDAL.deleteUserByEmail(user.email);
      }
      return result ? true : false;
    } catch (err) {
      if (err instanceof AppError && err.isOperational) throw err;
      throw new AppError('addUser', 500, 'error deleting user', true);
    }
  }

  /**
   * get user by email
   * @param email 
   * @returns user or null
   */
  async getUserByEmail(email: string) {
    try {
      const user = await this.userDAL.getUserByEmail(email);
      return user;
    } catch (err) {
      throw new AppError('getUser', 500, 'error getting user', true);
    }
  }

  /**
   * get user by user id.
   * @param id 
   * @returns user or null
   */
  async getUserByID(id: string) {
    try {
      const user = await this.userDAL.getUserByID(id);
      return user;
    } catch (err) {
      throw new AppError('getUser', 500, 'error getting user', true);
    }
  }

  /**
   * update user  details
   * @param userID 
   * @param userDetails 
   * @returns 
   */
  async updateUser(userID: string, userDetails: Partial<User>) {
    try {
      delete userDetails.id;
      return await this.userDAL.updateUser(userID, userDetails);
    } catch (err) {
      throw new AppError('updateUser', 500, 'error updating user', true);
    }
  }

  /**
   * change user password
   * @param id user id
   * @param currentPW current password
   * @param newPW new password
   */
  async changePassword(id: string, currentPW: string, newPW: string) {
    try {
      //check if current password is correct
      if (await this.passwordServices.verifyPasswordByID(id, currentPW)) {
        await this.passwordServices.changePassword(id, newPW);
        return true;
      } else {
        throw new AppError('change password', 400, 'incorrect password', true);
      }
    } catch (err) {
      if (err instanceof AppError && err.isOperational) throw err;
      throw new AppError('password service', 500, 'error changing password', true);
    }
  }

  async getUser({ id, email }: User) {
    try {
      let user: User | null = null;
      if (email) {
        user = await this.userDAL.getUserByEmail(email);
      } else if (id) {
        user = await this.userDAL.getUserByID(id);
      }
      return user;
    } catch (err) {
      throw new AppError('getUser', 500, 'error getting user', true);
    }
  }
}

const defaultUserServices = new UserServices(userRepo, passwordServices, uuidv4);

export default defaultUserServices;
