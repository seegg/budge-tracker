import connection from "../../db/connection";

interface PasswordRow {
  user_id: string,
  password_hash: string,
  salt: string
}

export const passwordRepo = (db = connection) => {

  const getPasswordDetails = async (userID: string) => {
    try {
      const [pwDetails] = await db('passwords').where('user_id', userID);
      return pwDetails as PasswordRow || null;
    } catch (err) {
      console.error(err);
      throw new Error('db error');
    }
  };

  const getPasswordDetailsByEmail = async (email: string) => {
    try {
      const getUserIDSuquery = db('users').where('email', email).select('id');
      const [pwDetails] = await db('passwords').where('user_id', 'in', getUserIDSuquery);
      return pwDetails as PasswordRow || null;
    } catch (err) {
      console.error(err);
      throw new Error('db error');
    }
  };

  const updatePasswordDetails = async (userID: string, newPassword: string, newSalt: string) => {
    try {
      await db('passwords')
        .update({ password_hash: newPassword, salt: newSalt })
        .where('user_id', userID);
    } catch (err) {
      console.error(err);
      throw new Error('db error');
    }
  }

  const updatePassword = async (userID: string, newPasswordHash: string) => {
    try {
      await db('passwords')
        .update({ password_hash: newPasswordHash })
        .where('user_id', userID);
    } catch (err) {
      console.error(err);
      throw new Error('db error');
    }
  };

  const updateSalt = async (userID: string, newSalt: string) => {
    try {
      await db('passwords')
        .update({ salt: newSalt })
        .where('user_id', userID);
    } catch (err) {
      console.error(err);
      throw new Error('db error');
    }
  };

  return {
    getPasswordDetails,
    getPasswordDetailsByEmail,
    updatePassword,
    updateSalt,
    updatePasswordDetails,
  };
}

export default passwordRepo();