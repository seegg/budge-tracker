import express, { ErrorRequestHandler } from 'express';
import { AppError, errorHandler } from './error';
import { userAPI } from './user';
import { authAPI } from './auth';

const server = express();
server.use(express.urlencoded());
server.use(express.json());

server.use('/api/v1/users', userAPI);
server.use('/api/v1/auth', authAPI);

//404
server.use('/*', (req, res, next) => {
  next(new AppError('not found', 404, 'not found', true));
});

//custom error handler
const errorReqHandler: ErrorRequestHandler = async (err, req, res, next) => {
  await errorHandler(err, res, next);
};
server.use(errorReqHandler);

//exit on uncaught errors
process.on('uncaughtException', (error) => {
  console.log(error);
  process.exit();
})

export default server;