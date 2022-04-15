import express from 'express';
import usersController from './users-controller';
import { isAuthenticated, validateBody } from '../auth/middleware';
import { validateChangePassword } from '.';

const router = express.Router();

router.get('/id/:id', isAuthenticated, usersController.getUser); //get user by id
router.post('/add', usersController.postUser); //add new user
//authenticated, validate new password, change password
router.post('/change-password/', isAuthenticated, validateBody(validateChangePassword), usersController.postChangePassword);

export default router;