import Joi from "joi";

const schema = Joi.object({
  password: Joi.string(),
  new_password: Joi.string()
    .min(8)
    .max(128)
    .required(),
  repeat_new_password: Joi.ref('new_password')
})
  .with('new_password', 'repeat_new_password');

export default schema;