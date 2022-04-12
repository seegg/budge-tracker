export default class AppError extends Error {
  name: string;
  statusCode: number;
  isOperational: boolean;
  constructor(name: string, statusCode: number, message: string, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}