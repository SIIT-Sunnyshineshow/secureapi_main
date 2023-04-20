const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: "./.env" });

const Schema = mongoose.Schema;

var sessionSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//Age will be told in the token so don't worry, just verify it with JWT

module.exports = sessionSchema;
