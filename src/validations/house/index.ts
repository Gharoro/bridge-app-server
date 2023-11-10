import Joi from "joi";

export const createHouseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  price: Joi.number().required(),
  number_of_rooms: Joi.number().required(),
  amenities: Joi.array().items(Joi.string()).required(),
});
