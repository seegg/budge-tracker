import Joi from "joi";

/**
 * Joi schema for validating input for registering a new user.
 */
const schema = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(64)
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2 }),
  password: Joi.string()
    .min(8)
    .max(128)
    .required(),
  repeat_password: Joi.ref('password'),
})
  .with('password', 'repeat_password');

export default schema;