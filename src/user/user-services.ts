import { User } from "./user-types";
import { v4 as uuidv4 } from 'uuid';
import { AppError } from "../error";
import { passwordServices as passwordServiceModule } from "../auth/password";
import userDB from './user-repo';

/**
 * create user services with dependencies as parameters
 */
export const userServices = (userDAL = userDB, passwordServices = passwordServiceModule, idGenerator = uuidv4) => {

  return {
    /**
     * Add a new user
     * @returns return user if successful.
     */
    async addUser({ name, email, password }: { name: string, email: string, password: string }) {
      try {
        //check if the email is available
        if (await userDAL.getUserByEmail(email)) {
          throw new AppError('add user', 400, 'email already in use', true);
        }
        //generate uuid and add it to user object. salt and hash the password.
        const id = idGenerator();
        const newUser: User = { name, email, id, verified: false };
        const salt = passwordServices.generateSalt();
        const passwordHash = passwordServices.hashPassword(password, salt);
        await userDAL.insertUser(<User>newUser, passwordHash, salt);
        return newUser;
      } catch (err) {
        if (err instanceof AppError && err.isOperational) throw err;
        throw new AppError('addUser', 500, 'error adding user', true);
      }
    },

    async deleteUser(user: User) {
      try {
        let result = 0;
        //checks if id or email is provided in user object, user either to delete.
        if (user.id) {
          result = await userDAL.deleteUserByID(user.id);
        } else if (user.email) {
          result = await userDAL.deleteUserByEmail(user.email);
        }
        return result;
      } catch (err) {
        throw new AppError('deleteuser', 500, 'error deleting user', true);
      }

    },

    async getUser({ id, email }: User) {
      try {
        let user: User | null = null;
        if (email) {
          user = await userDAL.getUserByEmail(email);
        } else if (id) {
          user = await userDAL.getUserByID(id);
        }
        return user;
      } catch (err) {
        throw new AppError('getUser', 500, 'error getting user', true);
      }
    },

    async getUserByEmail(email: string) {
      try {
        const user = await userDAL.getUserByEmail(email);
        return user;
      } catch (err) {
        throw new AppError('getUser', 500, 'error getting user', true);
      }
    },

    async getUserByID(id: string) {
      try {
        const user = await userDAL.getUserByID(id);
        return user;
      } catch (err) {
        throw new AppError('getUser', 500, 'error getting user', true);
      }
    },

    async updateUser(userDetails: User) {
      try {
        return await userDAL.updateUser(userDetails.id, userDetails);
      } catch (err) {
        throw new AppError('updateUser', 500, 'error updating user', true);
      }
    },

    /**
   * Change user password
   * @param id 
   * @param oldPassword current password.
   * @param newPassword password to be change to.
   */
    async changePassword(id: string, oldPassword: string, newPassword: string) {
      try {
        if (await passwordServices.verifyUserPasswordByID(id, oldPassword)) {
          await passwordServices.changePassword(id, newPassword);
          return true;
        } else {
          throw new AppError('change password', 400, 'incorrect password', true);
        }
      } catch (err) {
        if (err instanceof AppError && err.isOperational) throw err;
        throw new AppError('password service', 500, 'error changing password', true);
      }
    }
  }

}

export default userServices();