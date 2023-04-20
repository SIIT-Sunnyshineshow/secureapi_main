const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: "./.env" });

const Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  credentials: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Register Password Hash
userSchema.pre("save", (next) => {
  if (this.isModified("credentials")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.credentials, salt, (err, hash) => {
        this.credentials = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//Login and check credentials
userSchema.statics.login = (username, credentials) => {
  return this.findOne({ username }).then((msg) => {
    if (!msg) {
      return Promise.reject({ code: 400, message: "Invalid Data" });
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(credentials, msg.credentials, (err, res) => {
        if (res) {
          resolve(msg);
        } else {
          reject();
        }
      });
    });
  });
};

module.exports = userSchema;
