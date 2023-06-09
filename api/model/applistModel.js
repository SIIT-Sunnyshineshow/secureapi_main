const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var AppSchema = new Schema({
  appName: {
    type: String,
    required: true,
    trim: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  loginApi: {
    type: String,
    required: true,
    trim: true,
  },
  callbackLoginApi: {
    type: String,
    required: true,
    trim: true,
  },
  apis: [String],
  attributes: [String],
  appSecretKey: {
    type: String,
    required: true,
  },
});

module.exports = AppSchema;
