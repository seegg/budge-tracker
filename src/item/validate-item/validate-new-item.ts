import Joi from "joi";

const schema = Joi.object(
  {
    name: Joi.string()
      .required(),
    price: Joi.number()
      .required(),
    purchase_date: Joi.number()
      .required(),
    description: Joi.string(),
    tag_id: Joi.number(),
  }
);

export default schema;