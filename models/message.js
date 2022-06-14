const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  "message": { type: String, required: true },
  "created_date": { type: Date, default: Date.now },
  "grab_id": { type: String, required: true,index:true },
  "device_imei": { type: String, required: true },
  "datetime": { type: Number, required: true,index:true },
  "lat": { type: String },
  "lon":  { type: String },
  "speed":  { type: String },
  "alt":  { type: String },
  "gps_status":  { type: String },
  "battery":  { type: String },
  "provider":  { type: String },
  "realtime_nanos": { type: String },
  "bearing":  { type: String },
  "accuracy":  { type: String },
  "appversion":  { type: String },
  "timestamp":  { type: Date ,index:true},
  "sid":  { type: String },
});

module.exports = mongoose.model("rider_location", locationSchema,"riderlocation");
