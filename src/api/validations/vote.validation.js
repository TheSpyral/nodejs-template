const Joi = require("joi");
const { Vote } = require("../models");

module.exports = {
  // POST /v1/vote
  createVote: {
    body: {
      number: Joi.array().max(10).unique()
    },
  },
};
