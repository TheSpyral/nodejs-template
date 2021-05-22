const httpStatus = require("http-status");
const { omit } = require("lodash");
const { User } = require("../models");
const constants = require("../../config/constants");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.toJSON());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.toJSON());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const savedUser = await User.create(req.body);
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = User.build(req.body);
    const ommitRole = user.role !== "admin" ? "role" : "";
    const newUserObject = omit(newUser.toObject(), "id", ommitRole);

    await user.update(newUserObject, { override: true, upsert: true });
    const savedUser = await User.get(user.id);

    res.json(savedUser.toJSON());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== "admin" ? "role" : "";
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  user
    .save()
    .then((savedUser) => res.json(savedUser.toJSON()))
    .catch((e) => next(User.checkDuplicateEmail(e)));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    const transformedUsers = users.map((user) => user.transform());
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;

  user
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};

exports.topup = (req, res, next) => {
  const { user } = req.locals;
  const current_amount = user.amount;
  const { amount } = req.body;
  user.amount = amount + current_amount;
  user
    .save()
    .then((savedUser) =>
      res.json({
        id: savedUser._id,
        amount: savedUser.amount,
        username: savedUser.username,
      })
    )
    .catch((e) => next(e));
};
