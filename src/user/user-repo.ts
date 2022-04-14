import connection from "../db/connection";
import { User } from "./user-types";


export const userRepo = (db = connection) => {
  const getUserByID = async (id: string) => {
    try {
      const [user]: User[] = await db('users').where('id', id);
      return user || null;
    } catch (err) {
      console.error(err);
      throw new Error('db error');
    }
  };

  const getUserByEmail = async (email: string) => {
    try {
      const [user]: User[] = await db('users').where('email', email);
      return user || null;
    } catch (err) {
      console.error(err);
      throw new Error('db error');
    }
  };

  /**
   * User a transaction to insert both a new user and associated password hash and salt
   */
  const insertUser = async (newUser: User, passwordHash: string, salt: string) => {
    try {
      await db.transaction(async trx => {
        const [id] = await trx('users').insert(newUser, 'id');
        await trx('passwords').insert({ user_id: id, password_hash: passwordHash, salt });
      });
    } catch (err) {
      console.error(err);
      throw new Error('db error');
    }
  };

  const deleteUserByID = async (id: string) => {
    try {
      return await
        db('users')
          .where('id', id)
          .del();
    } catch (err) {
      console.error(err);
      throw new Error('db error');
    }
  };

  const deleteUserByEmail = async (email: string) => {
    try {
      return await
        db('users')
          .where('email', email)
          .del();
    } catch (err) {
      console.error(err);
      throw new Error('db error');
    }
  };

  const updateUser = async (userID: string, newUser: Partial<User>) => {
    try {
      return await
        db('users')
          .update(newUser)
          .where('id', userID);
    } catch (err) {
      console.error(err)
      throw new Error('db error');
    }
  };

  return {
    updateUser,
    insertUser,
    deleteUserByEmail,
    deleteUserByID,
    getUserByEmail,
    getUserByID
  };

};

export default userRepo();