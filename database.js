require('dotenv').config();
const mongoose = require("mongoose");
const url = process.env.MONGODB_CONNECTION_URL_LOCATION_SERVICE;
let _db;

module.exports = {
    connectToServer: function (callback) {
        mongoose
            .connect(url, { dbName: process.env.MONGDB_DBNAME_LOCATION_SERVICE, useNewUrlParser: true })
            .then((database) => {
                _db = database;
                return callback({});
            })
            .catch((err) => console.error("db connection error",err));
    },

    getDb: function () {
        return _db;
    }
};