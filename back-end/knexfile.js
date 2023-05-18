/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgres://wyrzuqmj:M2e_fe8Z1uysBER4WKRy_i2p79pWeYwg@isilo.db.elephantsql.com/wyrzuqmj",
  DATABASE_URL_DEVELOPMENT = "postgres://jhcvgekl:Lx_QPLBCwM9y3rLhCEWWE-Z_4cG1JM6j@isilo.db.elephantsql.com/jhcvgekl",
  DATABASE_URL_TEST = "postgres://djzhqeum:cfjNgwvsCWRvhbV0pAh0VTSjQahk6AHL@isilo.db.elephantsql.com/djzhqeum",
  DATABASE_URL_PREVIEW = "postgres://rkdlahog:***@isilo.db.elephantsql.com/rkdlahog",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
