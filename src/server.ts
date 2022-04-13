import express, { ErrorRequestHandler } from 'express';
import { errorHandler } from './error';
import { userAPI } from './user';

const server = express();
server.use(express.json());

server.use('/api/v1/', userAPI);

//custom error handler
const errorReqHandler: ErrorRequestHandler = async (err, req, res, next) => {
  await errorHandler(err, res, next);
};
server.use(errorReqHandler);

export default server;