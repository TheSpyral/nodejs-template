const httpStatus = require("http-status");
const { User } = require("../models");
const moment = require("moment-timezone");
const { jwtExpirationInterval } = require("../../config/vars");

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = "Bearer";
  const expiresIn = moment().add(jwtExpirationInterval, "minutes");
  return {
    tokenType,
    accessToken,
    expiresIn,
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    // const userData = omit(req.body, 'role');
    const userData = req.body;
    const user = await User.create(userData);
    const userTransformed = user.transform();
    const token = generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    return res.json({
      status: httpStatus.OK,
      message: "success",
      data: { token, user: userTransformed },
    });
  } catch (error) {
    return next(error);
  }
};
/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    return res.json({
      status: httpStatus.OK,
      message: "success",
      data: { token, user: user.transform() },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    const { user, accessToken } = await User.findAndGenerateToken({
      email,
      refreshObject,
    });
    const token = generateTokenResponse(user, accessToken);
    return res.json({
      status: httpStatus.OK,
      message: "success",
      data: { token },
    });
  } catch (error) {
    return next(error);
  }
};
