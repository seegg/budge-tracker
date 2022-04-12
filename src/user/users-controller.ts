import { RequestHandler } from "express";
import userServices from "./user-services";

export const userHandlers = (services = userServices) => {
  const getUser: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await services.getUserByID(id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  const postUser: RequestHandler = async (req, res, next) => {
    try {
      const user = await services.addUser(req.body);
      res.json(user);
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