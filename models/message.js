const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  "message": { type: String, required: true },
  "created_date": { type: Date, default: Date.now },
  "grab_id": { type: String, required: true },
  "device_imei": { type: String, required: true },
  "datetime": { type: String, required: true },
  "lat": { type: String,required:false },
  "lon":  { type: String,required:false },
  "speed":  { type: String,required:false },
  "alt":  { type: String,required:false },
  "gps_status":  { type: String,required:false },
  "battery":  { type: String,required:false },
  "provider":  { type: String,required:false },
  "realtime_nanos": { type: String,required:false },
  "bearing":  { type: String,required:false },
  "accuracy":  { type: String,required:false },
  "appversion":  { type: String,required:false },
  "timestamp":  { type: String,required:false },
  "sid":  { type: String,required:false },
});

module.exports = mongoose.model("rider_location", locationSchema,"riderlocation");
