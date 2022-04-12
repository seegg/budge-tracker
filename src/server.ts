import express, { ErrorRequestHandler } from 'express';
import { AppError, errorHandler } from './error';

const server = express();

server.use(express.json());

server.use('/', (req, res) => {
  res.json('hello');
});

const errorReqHandler: ErrorRequestHandler = async (err, req, res, next) => {
  await errorHandler(err, res, next);
};
server.use(errorReqHandler);

export default server;