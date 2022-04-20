import { RequestHandler } from 'express';
import { AppError } from '../../error';
import authServiceModule from '../auth-services';

/**
 * Middleware to authenticate user using jwt.
 * user object is attach to res.locals after authentication.
 * @param authServices auth services module.
 * @returns Request Handler to authenticate using json web token.
 */
export const authenticate = (authServices = authServiceModule): RequestHandler => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]; //get token from authorization header
      if (!token) throw new AppError('unauthenticated', 401, 'not authenticated', true);
      //parse token and attach user object to locals for subsequent requests.
      const user = authServices.parseAccessToken(token);
      res.locals.user = user;

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default authenticate();