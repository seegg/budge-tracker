
import { RequestHandler } from "express"
import { ObjectSchema } from "joi"

const validateBody = (schema: ObjectSchema): RequestHandler => {
  return (req, res, next) => {
  }
}

export default validateBody;
