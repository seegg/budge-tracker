import express from 'express';
import usersController from './users-controller';
import { isAuthenticated, validateBody } from '../auth/middleware';
import { validateNewUser } from '.';
import { validateChangePassword } from '.';

const router = express.Router();

//get user by id
router.get('/id/:id', isAuthenticated,
  usersController.getUser);

//add new user
router.post('/add', validateBody(validateNewUser),
  usersController.postUser);

//authenticated, validate new password, change password
router.post('/change-password/',
  isAuthenticated,
  validateBody(validateChangePassword),
  usersController.postChangePassword);

export default router;