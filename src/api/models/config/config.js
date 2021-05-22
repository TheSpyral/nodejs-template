const fs = require("fs");

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "123",
    database: process.env.DB_NAME || "event_manager_dev",
    host: process.env.DB_HOSTNAME || "127.0.0.1",
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
  },
  production: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "123",
    database: process.env.DB_NAME || "event_manager_prod",
    host: process.env.DB_HOSTNAME || "127.0.0.1",
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
  },
};
