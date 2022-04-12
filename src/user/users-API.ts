import express from 'express';
import usersController from './users-controller';

const router = express.Router();

router.get('/:id', usersController.getUser);
router.post('/', usersController.postUser);

export default router;