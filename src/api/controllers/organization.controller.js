const httpStatus = require("http-status");
const { omit } = require("lodash");
const { Organization } = require("../models");
const constants = require("../../config/constants");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const organization = await Organization.get(id);
    req.locals = { organization };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.organization.toJSON());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const savedOrganization = await Organization.create(req.body);
    res.status(httpStatus.CREATED);
    res.json(savedOrganization.transform());
  } catch (error) {
    next();
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { organization } = req.locals;
    const newOrganization = Organization.build(req.body);
    await organization.update(newOrganization, { override: true, upsert: true });
    const savedOrganization = await Organization.get(organization.id);

    res.json(savedOrganization.toJSON());
  } catch (error) {
    next();
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const updatedOrganization = req.body;
  const organization = Object.assign(req.locals.organization, updatedOrganization);

  organization
    .save()
    .then((val) => res.json(val.toJSON()))
    .catch((e) => next(Organization.checkDuplicateEmail(e)));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const organizations = await Organization.list(req.query);
    const transformedOrganizations = organizations.map((organization) => organization.transform());
    res.json(transformedOrganizations);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { organization } = req.locals;

  organization
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e) => next(e));
};

