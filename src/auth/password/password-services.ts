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
      const pwHash = hashPassword(password, passwordDetails.salt);
      return pwHash === passwordDetails.passwordHash;
    } catch (err) {
      throw new AppError('password service', 500, 'error verifying password', true);
    }
  }

  /**
   * verify password is correct.
   */
  const verifyUserPasswordByID = async (userID: string, password: string) => {
    try {
      const passwordDetails = await pwRepo.getPasswordDetails(userID);
      const pwHash = hashPassword(password, passwordDetails.salt);
      return pwHash === passwordDetails.passwordHash;
    } catch (err) {
      throw new AppError('password service', 500, 'error verifying password', true);
    }
  };

  const changePassword = async (userID: string, oldPassword: string, newPassword: string) => {
    try {
      if (await verifyUserPasswordByID(userID, oldPassword)) {
        await pwRepo.updatePassword(userID, newPassword);
        return true;
      } else {
        return false;
      }
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
