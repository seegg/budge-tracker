import connection from "../../db/connection";

interface PasswordRow {
  user_id: string,
  password_hash: string,
  salt: string
}

export class PasswordRepo {
  private db;

  constructor(db = connection) {
    this.db = db;
  }

  async getPasswordDetails(userID: string) {
    const [pwDetails] = await this.db('passwords').where('user_id', userID);
    return pwDetails as PasswordRow || null;
  }

  async getPasswordDetailsByEmail(email: string) {
    const getUserIDSuquery = this.db('users').where('email', email).select('id');
    const [pwDetails] = await this.db('passwords').where('user_id', 'in', getUserIDSuquery);
    return pwDetails as PasswordRow || null;
  }

  async updatePasswordDetails(userID: string, newPassword: string, newSalt: string) {
    return await this.db('passwords')
      .update({ password_hash: newPassword, salt: newSalt })
      .where('user_id', userID);
  }

  async updatePassword(userID: string, newPassword: string) {
    return await this.db('passwords')
      .update({ password_hash: newPassword })
      .where('user_id', userID);
  }

  async updateSalt(userID: string, newSalt: string) {
    return await this.db('passwords')
      .update({ salt: newSalt })
      .where('user_id', userID);
  }

}

export default new PasswordRepo();