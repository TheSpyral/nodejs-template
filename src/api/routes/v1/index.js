/*eslint-disable */

const express = require("express");

const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const organizationRoutes = require("./organization.route");

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

/**
 * GET v1/docs
 */
router.use("/docs", express.static("docs"));
router.use("/assets", express.static("assets"));

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/organization", organizationRoutes);

module.exports = router;
