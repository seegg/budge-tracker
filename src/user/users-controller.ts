import { RequestHandler } from "express";
import userSerivcesModule from "./user-services";

export const userHandlers = (userServices = userSerivcesModule) => {

  const getUser: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userServices.getUserByID(id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  const postUser: RequestHandler = async (req, res, next) => {
    try {
      const { user, password } = req.body;
      const newUser = await userServices.addUser(user, password);
      res.json(newUser);
    } catch (err) {
      next(err);
    }
  };

  return {
    getUser,
    postUser
  };
}

export default userHandlers();