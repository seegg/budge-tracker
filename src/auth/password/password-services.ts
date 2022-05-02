import { pbkdf2Sync, randomBytes } from 'crypto';
import { AppError } from '../../error';
import passwordDB from './password-repo';
import { HashFunc } from './types';

export class PasswordServices {
  private hashFunction;
  private saltGenerator;
  private passwordDAL;

  /**
   * @param passwordDAL password db functions
   * @param hashFunc function to hash password
   * @param saltGenerator generate salt for password
   */
  constructor(
    passwordDAL = passwordDB,
    hashFunc: HashFunc = pbkdf2Sync,
    saltGenerator: (size: number) => Buffer | string = randomBytes
  ) {
    this.hashFunction = hashFunc;
    this.saltGenerator = saltGenerator;
    this.passwordDAL = passwordDAL;
  }

  /**
   * Hash a password with salt
   * @param password password to be hash
   * @param salt salt for the password
   * @returns hex string
   */
  async hashPassword(password: string, salt: string) {
    return await this.hashFunction(password, salt, 1000, 64, 'sha512').toString('hex');
  }

  /**
   * Generate random bytes as salt for password
   * @param size numer of bytes. default 16.
   */
  async generateSalt(size: number = 16) {
    return await this.saltGenerator(size).toString('hex');

  }

  /**
   * Check if the password matches the one associated with the email
   * @param email 
   * @param password 
   * @returns true or false whether password matches email
   */
  async verifyPasswordByEmail(email: string, password: string) {
    const passwordDetails = await this.passwordDAL.getPasswordDetailsByEmail(email);
    if (!passwordDetails) return false;
    const pwHash = await this.hashPassword(password, passwordDetails.salt);
    return pwHash === passwordDetails.password_hash;

  }

  /**
  * Check if the password matches the one associated with the userID
  * @param userID 
  * @param password 
  * @returns true or false whether password matches userID
  */
  async verifyPasswordByID(userID: string, password: string) {
    const passwordDetails = await this.passwordDAL.getPasswordDetails(userID);
    if (!passwordDetails) return false;
    const pwHash = await this.hashPassword(password, passwordDetails.salt);

  }

  /**
   * Update password for a given user.
   * @param userID 
   * @param newPassword 
   */
  async changePassword(userID: string, newPassword: string) {
    const { salt } = await this.passwordDAL.getPasswordDetails(userID);
    if (!salt) throw new AppError('', 401, "User doesn't exist", true);
    const newPWHash = await this.hashPassword(newPassword, salt);
    await this.passwordDAL.updatePassword(userID, newPWHash);
  }

}

const defaultServices = new PasswordServices(passwordDB, pbkdf2Sync, randomBytes);

// export default passwordServices();
export default defaultServices;
