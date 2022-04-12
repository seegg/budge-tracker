import connection from "../db/connection";
import { User } from "./user-types";

export const getUserByID = async (id: string, db = connection) => {
  try {
    const [user]: User[] = await db('users').where('id', id);
    return user;
  } catch (err) {
    console.error(err);
    throw new Error('db error');
  }
};

export const getUserByEmail = async (email: string, db = connection) => {
  try {
    const [user]: User[] = await db('users').where('email', email);
    return user;
  } catch (err) {
    console.error(err);
    throw new Error('db error');
  }
};

export const insertUser = async (newUser: User, db = connection) => {
  try {
    return await db('users').insert(newUser);
  } catch (err) {
    console.error(err);
    throw new Error('db error');
  }
};

export const deleteUserByID = async (id: string, db = connection) => {
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

export const deleteUserByEmail = async (email: string, db = connection) => {
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

export const updateUser = async (userID: string, newUser: Partial<User>, db = connection) => {
  try {
    return await
      db('users')
        .update(newUser)
        .where('id', userID);
  } catch (err) {
    console.error(err)
    throw new Error('db error');
  }
}

export const userDB = {
  updateUser,
  insertUser,
  deleteUserByEmail,
  deleteUserByID,
  getUserByEmail,
  getUserByID
}
