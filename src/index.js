// make bluebird default Promise
Promise = require("bluebird"); // eslint-disable-line no-global-assign
const { port, env } = require("./config/vars");
const logger = require("./config/logger");
const { server } = require("./config/express");
const path = require("path");
const db = require("./api/models");
db.sequelize.authenticate().then(() => {
  console.log("connection database success");
  server.listen(port, () => {
    logger.info(`server started on port ${port} (${env})`);
  });
});
// listen to requests

global.__basedir = path.join("..", __dirname);

/**
 * Exports express
 * @public
 */
module.exports = server;
