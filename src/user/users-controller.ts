import { RequestHandler } from "express";
import { AppError } from "../error";
import userSerivcesModule from "./user-services";

export const userHandlers = (userServices = userSerivcesModule) => {

  const getUser: RequestHandler[] = [
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const user = await userServices.getUserByID(id);
        if (user === null) throw new AppError('not found', 404, 'user does not exists', true);
        res.status(200).json(user);
      } catch (err) {
        next(err);
      }
    }
  ];

  const postUser: RequestHandler = async (req, res, next) => {
    try {
      const newUser = await userServices.addUser(req.body);
      res.status(200).json(newUser);
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