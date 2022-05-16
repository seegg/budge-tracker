import connection from "../../db/connection";

interface PasswordRow {
  user_id: string,
  password_hash: string,
  salt: string
}

export const passwordRepo = (db = connection) => {

  const getPasswordDetails = async (userID: string) => {
    const [pwDetails] = await db('passwords').where('user_id', userID);
    return pwDetails as PasswordRow || null;
  };

  const getPasswordDetailsByEmail = async (email: string) => {
    const getUserIDSuquery = db('users').where('email', email).select('id');
    const [pwDetails] = await db('passwords').where('user_id', 'in', getUserIDSuquery);
    return pwDetails as PasswordRow || null;
  };

  const updatePasswordDetails = async (userID: string, newPassword: string, newSalt: string) => {
    await db('passwords')
      .update({ password_hash: newPassword, salt: newSalt })
      .where('user_id', userID);
  }

  const updatePassword = async (userID: string, newPasswordHash: string) => {
    await db('passwords')
      .update({ password_hash: newPasswordHash })
      .where('user_id', userID);
  };

  const updateSalt = async (userID: string, newSalt: string) => {
    await db('passwords')
      .update({ salt: newSalt })
      .where('user_id', userID);
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