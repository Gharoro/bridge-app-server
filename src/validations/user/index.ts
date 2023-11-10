import Joi from "joi";

export const signupSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .min(8)
    .regex(/[a-zA-Z]/)
    .message(
      "Password must be at least 8 characters long and contain at least one alphabet."
    )
    .required(),
  profile_picture: Joi.string().required(),
  role: Joi.string().valid("admin", "landlord", "tenant").required(),
});

export const confirmEmailSchema = Joi.object({
  signup_token: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .min(8)
    .regex(/[a-zA-Z]/)
    .message(
      "Password must be at least 8 characters long and contain at least one alphabet."
    )
    .required(),
});
