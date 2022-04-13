import connection from "../../db/connection";
import { PasswordDetails } from "./types";

export const getPasswordDetails = async (userID: string, db = connection) => {
  try {
    const password = await db('passwords').where('user_id', userID);
    return password[0] as PasswordDetails;
  } catch (err) {
    console.error(err);
    throw new Error('db error');
  }
};

export const getPasswordDetailsByEmail = async (email: string, db = connection) => {
  try {
    const getUserIDSuquery = db('users').where('email', email).select('id');
    const password = await db('passwords').where('user_id', 'in', getUserIDSuquery);
    return password[0] as PasswordDetails;
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