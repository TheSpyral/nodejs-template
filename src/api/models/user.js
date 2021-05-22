"use strict";

const bcrypt = require("bcryptjs");
const httpStatus = require("http-status");
const moment = require("moment-timezone");
const jwt = require("jwt-simple");
const APIError = require("../utils/APIError");
const errorMessage = require("../utils/errorMessages");
const _ = require("lodash");

const { env, jwtSecret, jwtExpirationInterval } = require("../../config/vars");

const roles = ["user", "admin", "sub_admin"];

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          const rounds = env === "test" ? 1 : 10;
          this.setDataValue("password", bcrypt.hashSync(value, rounds));
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          max: 128,
        },
      },
      active: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: true,
        get(active) {
          return this.getDataValue(active) === 1;
        },
      },
      role: { type: DataTypes.STRING, allowNull: true, defaultValue: "user" },
    },
    { tableName: "users" },
  );
  User.associate = function (models) {
    // associations can be defined here
  };

  User.prototype.passwordMatches = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  };

  User.prototype.token = function () {
    const payload = {
      exp: moment().add(jwtExpirationInterval, "minutes").unix(),
      iat: moment().unix(),
      sub: this.id,
      claims: { email: this.email, createdAt: this.createdAt },
    };
    return jwt.encode(payload, jwtSecret);
  };

  User.prototype.transform = function () {
    return _.omit(this.toJSON(), ["password"]);
  };

  User.get = async function (id) {
    const user = await User.findByPk(id);
    if (user) {
      return user;
    }
    return null;
  };

  User.findAndGenerateToken = async function (options) {
    const { email, password, refreshObject } = options;
    if (!email)
      throw new APIError({
        message: errorMessage.AUTH.EMAIL,
        errors: errorMessage.AUTH.EMAIL,
      });

    const user = await User.findOne({ where: { email } });
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      if (user && (await user.passwordMatches(password))) {
        return { user, accessToken: user.token() };
      }
      err.message = errorMessage.AUTH.PASSWORD;
      err.errors = errorMessage.AUTH.PASSWORD;
    } else if (refreshObject && refreshObject.email === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = errorMessage.AUTH.TOKEN;
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = errorMessage.AUTH.EMAIL_OR_TOKEN;
      err.errors = errorMessage.AUTH.EMAIL_OR_TOKEN;
    }
    throw new APIError(err);
  };

  return User;
};
