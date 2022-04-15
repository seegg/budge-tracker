import { pbkdf2Sync, randomBytes } from 'crypto';
import { AppError } from '../../error';
import passwordDB from './password-repo';

export const passwordServices = (passwordHashService = pbkdf2Sync, generateByetes = randomBytes, pwRepo = passwordDB) => {

  /**
   * hash a password with salt.
   */
  const hashPassword = (password: string, salt: string) => {
    try {
      return passwordHashService(password, salt, 1000, 64, 'sha512').toString('hex');
    } catch (err) {
      throw new AppError('auth services', 500, 'problem with password', true);
    }
  };

  /**
   * helper function for generating a random hex string.
   * default 16byte
   */
  const generateSalt = (size = 16) => {
    return generateByetes(size).toString('hex');
  };

  const verifyUserPasswordByEmail = async (email: string, password: string) => {
    try {
      const passwordDetails = await pwRepo.getPasswordDetailsByEmail(email);
      if (!passwordDetails) return false;
      const pwHash = hashPassword(password, passwordDetails.salt);
      return pwHash === passwordDetails.password_hash;
    } catch (err) {
      throw new AppError('password service', 500, 'error verifying password', true);
    }
  }

  /**
   * verify password is correct.
   */
  const verifyUserPasswordByID = async (userID: string, password: string) => {
    try {
      const { password_hash, salt } = await pwRepo.getPasswordDetails(userID);
      const pwHash = hashPassword(password, salt);
      return pwHash === password_hash;
    } catch (err) {
      throw new AppError('password service', 500, 'error verifying password', true);
    }
  };

  /**
   * Hash and update a user's password.
   */
  const changePassword = async (userID: string, newPassword: string) => {
    try {
      const { salt } = await pwRepo.getPasswordDetails(userID);
      const newPWHash = hashPassword(newPassword, salt);
      await pwRepo.updatePassword(userID, newPWHash);
      return true;
    } catch (err) {
      throw new AppError('password service', 500, 'error changing password', true);
    }
  };

  return {
    hashPassword,
    generateSalt,
    verifyUserPasswordByID,
    verifyUserPasswordByEmail,
    changePassword
  }

};

export default passwordServices();
