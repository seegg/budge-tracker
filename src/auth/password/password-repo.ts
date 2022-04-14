import connection from "../../db/connection";
import { PasswordDetails } from "./types";

interface PasswordRow {
  user_id: string,
  password_hash: string,
  salt: string
}

export const getPasswordDetails = async (userID: string, db = connection) => {
  try {
    const [pwDetails] = await db('passwords').where('user_id', userID);
    return pwDetails as PasswordRow || null;
  } catch (err) {
    console.error(err);
    throw new Error('db error');
  }
};

export const getPasswordDetailsByEmail = async (email: string, db = connection) => {
  try {
    const getUserIDSuquery = db('users').where('email', email).select('id');
    const [pwDetails] = await db('passwords').where('user_id', 'in', getUserIDSuquery);
    return pwDetails as PasswordRow || null;
  } catch (err) {
    console.error(err);
    throw new Error('db error');
  }
};

export const updatePasswordDetails = async (userID: string, newPassword: string, newSalt: string, db = connection) => {
  try {
    await db('passwords')
      .update({ password_hash: newPassword, salt: newSalt })
      .where('user_id', userID);
  } catch (err) {
    console.error(err);
    throw new Error('db error');
  }
}

export const updatePassword = async (userID: string, newPasswordHash: string, db = connection) => {
  try {
    await db('passwords')
      .update({ password_hash: newPasswordHash })
      .where('user_id', userID);
  } catch (err) {
    console.error(err);
    throw new Error('db error');
  }
};

export const updateSalt = async (userID: string, newSalt: string, db = connection) => {
  try {
    await db('passwords')
      .update({ salt: newSalt })
      .where('user_id', userID);
  } catch (err) {
    console.error(err);
    throw new Error('db error');
  }
};

export default {
  getPasswordDetails,
  getPasswordDetailsByEmail,
  updatePassword,
  updateSalt,
  updatePasswordDetails,
}