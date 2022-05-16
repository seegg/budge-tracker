import connection from "../db/connection";
import { User } from "./user-types";
export class UserRepo {

  private db;

  constructor(db = connection,) {
    this.db = db;
  }

  async getUserByID(id: string) {
    const [user]: User[] = await this.db('users').where('id', id);
    return user || null;
  }

  async getUserByEmail(email: string) {
    const [user]: User[] = await this.db('users').where('email', email);
    return user || null;
  }

  /**
   * add new user and associated password hash and salt via db transtion.
   * @param newUser 
   * @param passwordHash 
   * @param salt 
   */
  async insertUser(newUser: User, passwordHash: string, salt: string) {
    try {
      await this.db.transaction(async trx => {
        const [{ id }] = await this.db('users')
          .insert(newUser, 'id')
          .transacting(trx);

        await this.db('passwords')
          .insert({ user_id: id, password_hash: passwordHash, salt })
          .transacting(trx);
      })
    } catch (err) {
      console.log(err);
    }
  }

  async deleteUserByID(id: string) {
    return await this.db('users').where('id', id).del();
  }

  async deleteUserByEmail(email: string) {
    return await this.db('users').where('email', email).del();
  }

  async updateUser(id: string, user: Partial<User>) {
    return await this.db('users').update(user).where('id', id);
  }
}

// export default userRepo();
export default new UserRepo();