const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  serviceType: { type: String, required: true },
  preferredDate: { type: String },
  preferredTime: { type: String },
  message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);