import Joi from "joi";

export const createBidSchema = Joi.object({
  description: Joi.string().required(),
  price: Joi.number().required(),
  house: Joi.number().required(),
});

export const createCounterBidSchema = Joi.object({
  description: Joi.string().required(),
  price: Joi.number().required(),
  bid: Joi.number().required(),
});
