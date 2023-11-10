import Joi from "joi";

export const verifyPaymentSchema = Joi.object({
  transaction_ref: Joi.string().required(),
  bid_id: Joi.number().required(),
});
