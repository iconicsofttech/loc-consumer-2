const { format, createLogger, transports } = require("winston");
const { timestamp, combine, errors, json } = format;
require("winston-mongodb");
require('dotenv').config();
let mongoUtil = require( '../database' );
let db = mongoUtil.getDb();
function buildProdLogger() {
  return createLogger({
    format: combine(
      timestamp(),
      errors({ stack: true }),
      format.metadata(),
      json()
    ),

    defaultMeta: { service: "consumer-service" },
    transports: [
      new transports.MongoDB({
        db: db.connections[0],
        options: {
          useUnifiedTopology: true,
        },
        collection: "server_logs",
      }),
    ],
  });
}

module.exports = buildProdLogger;
