import { RequestHandler } from "express"
import { ObjectSchema, ValidationOptions } from "joi"
import { AppError } from "../../error"

/**
 * Validate input in req.body.
 * @param schema Joi schema for values to be validated.
 */
const validateBody = (schema: ObjectSchema, options: ValidationOptions = { abortEarly: false }): RequestHandler => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, options || {});
    if (error) {
      //map the error messages into a single string and pass it onto the error handler.
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new AppError('validation error', 400, errorMessage, true));
    }
    next();
  }
}

export default validateBody;
