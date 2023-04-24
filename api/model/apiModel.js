const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var ApiSchema = new Schema({
  apiName: {
    type: String,
    required: true,
  },
  app_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  apiLink: {
    type: String,
    required: true,
  },
  apiPriLink: {
    type: String,
    required: true,
  },
  apiMethod: {
    type: String,
  },
  allowedAttributes: [String],
});
