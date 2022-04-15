import express from 'express';
import authController from './auth-controller';
import { validateBody } from './middleware';
import { validateLogin } from './validate-input';
import { validateNewUser } from '../user';


const router = express.Router();
router.post('/login', validateBody(validateLogin), authController.postLogin);
router.post('/register', validateBody(validateNewUser), authController.postRegister);
router.post('/refresh', /**TODO */);
router.get('/verify', /**TODO */);

export default router;