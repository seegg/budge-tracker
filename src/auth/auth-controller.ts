import { RequestHandler } from "express";
import authServiceModule from "./auth-services";

//TODO add validation middleware to handlers.

export const authController = (authServices = authServiceModule) => {

  const postLogin: RequestHandler = async (req, res, next) => {
    try {
      console.log('login');
      const { email, password } = req.body;
      const accessToken = await authServices.verifyByEmail(email, password);
      res.json({ accessToken });
    } catch (err) {
      next(err);
    }
  };

  const postRegister: RequestHandler = async (req, res, next) => {
    try {
      const newUser = await authServices.registerUser(req.body);
      const accessToken = authServices.generateAccessToken(newUser);
      res.json({ user: newUser, accessToken: accessToken });
    } catch (err) {
      next(err);
    }
  };

  const postVerify: RequestHandler = async (req, res, next) => { };

  const postRefreshToken: RequestHandler = async (req, res, next) => { };

  return {
    postLogin,
    postRegister,
    postVerify,
    postRefreshToken,
  };

};

export default authController();