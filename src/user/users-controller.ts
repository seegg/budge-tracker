import { RequestHandler } from "express";
import { AppError } from "../error";
import userSerivcesModule from "./user-services";
import { passwordServices as pwServiceModule } from "../auth/password";
import { User } from "./user-types";


export const userHandlers = (userServices = userSerivcesModule) => {

  /**
   * Get user request handler.
   */
  const getUser: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userServices.getUserByID(id);
      if (user === null) throw new AppError('not found', 404, "that user doesn't exist", true);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  /**
   * add a new user
   */
  const postUser: RequestHandler = async (req, res, next) => {
    try {
      const newUser = await userServices.addUser(req.body);
      res.status(200).json(newUser);
    } catch (err) {
      next(err);
    }
  };

  /**
   * change a user's password. password info is pass from req.body
   * user info is retrieved from res.locals after authentication
   */
  const postChangePassword: RequestHandler = async (req, res, next) => {
    try {
      const { id, email } = res.locals.user;
      const { old_password, new_password } = req.body;
      await userServices.changePassword(id, old_password, new_password);
      res.json({ message: 'password change successful' });
    } catch (err) {
      next(err);
    }
  }

  return {
    getUser,
    postUser,
    postChangePassword
  };
}

export default userHandlers();