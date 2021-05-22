const Joi = require("joi");
const { User } = require("../models");

module.exports = {
  // GET /v1/users
  listUsers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
      role: Joi.string().valid(["user", "admin", "sub_admin"]),
    },
  },

  // POST /v1/users
  createUser: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(["user", "admin", "sub_admin"]),
    },
  },

  // PUT /v1/users/:userId
  replaceUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(["user", "admin", "sub_admin"]),
    },
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email(),
      password: Joi.string().min(6).max(128),
      name: Joi.string().max(128),
      role: Joi.string().valid(["user", "admin", "sub_admin"]),
      active: Joi.boolean(),
    },
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
};
