const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  message: { type: String, required: true },
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("rider_location", locationSchema,"riderlocation");
