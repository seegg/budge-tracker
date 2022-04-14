import { RequestHandler } from "express";
import authServiceModule from "./auth-services";

export const authController = (authServices = authServiceModule) => {

  const postLogin: RequestHandler = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const accessToken = authServices.verifyByEmail(email, password);
      res.json({ accessToken });
    } catch (err) {
      next(err);
    }
  };

  const postRegister: RequestHandler = async (req, res, next) => {
    try {

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