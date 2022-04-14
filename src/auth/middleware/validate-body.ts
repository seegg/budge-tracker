
import { RequestHandler } from "express"
import Joi, { ObjectSchema } from "joi"
import { AppError } from "../../error"

const schema = Joi.object().keys()

/**
 * Validate input in req.body.
 * @param schema Joi schema for values to be validated.
 */
const validateBody = (schema: ObjectSchema): RequestHandler => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new AppError('validation error', 400, errorMessage, true));
    }
    next();
  }
}

export default validateBody;
