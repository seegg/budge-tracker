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
        const id = idGenerator();
        const newUser: User = { name, email, id, verified: false };
        const salt = passwordServices.generateSalt();
        const passwordHash = passwordServices.hashPassword(password, salt);
        await userDAL.insertUser(<User>newUser, passwordHash, salt);
        return newUser;
      } catch (err) {
        throw new AppError('addUser', 500, 'error adding user', true);
      }
    },

    async deleteUser(user: User) {
      try {
        let result = 0;
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
    }
  }

}

export default userServices();