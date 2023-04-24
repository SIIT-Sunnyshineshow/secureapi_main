const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const userSchema = require("./userModel");
const { randomUUID } = require("crypto");
const { access } = require("fs");
const Schema = mongoose.Schema;

var sessionSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  sessionID: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  //For Decoy App, uncomment this line
  // fromApp: {
  //   type: String,
  //   default: "DEFAULT",
  // },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//Used to sign token, saving token is the job of API
sessionSchema.statics.tokenSign = function (credentials, unique) {
  let clientAccessToken = jwt.sign(
    { credentials, unique },
    process.env.TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(clientAccessToken, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        let accessToken = hash;

        resolve({ clientAccessToken, accessToken });
      });
    });
  });
};

//Used to sign token, saving token is the job of API
sessionSchema.statics.refreshSign = function (
  accessToken,
  credentials,
  unique
) {
  let randomNum = randomUUID();
  let clientRefreshToken = jwt.sign(
    { accessToken, credentials, randomNum, unique },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(clientRefreshToken, salt, (err, hash) => {
        let refreshToken = hash;
        if (err) {
          reject(err);
        }
        resolve({ clientRefreshToken, refreshToken });
      });
    });
  });
};

//Check if the token is valid
//Logical Problem
sessionSchema.statics.loadAccess = function (sessionID, clientAccessToken) {
  //Valid?
  return new Promise((resolve, reject) => {
    jwt.verify(clientAccessToken, process.env.TOKEN_SECRET, (err, payload) => {
      if (err) {
        reject({
          code: 400,
          message: "Invalid Token",
          err: err,
        });
      }
      //Have?
      return this.findOne({ sessionID }).then((msg) => {
        if (!msg) {
          reject({ code: 400, message: "Invalid Data" });
        }

        //Match?
        let accessToken = msg.accessToken;
        bcrypt.compare(clientAccessToken, accessToken, (err, ret) => {
          if (err) {
            console.log(err);
            reject({ code: 400, message: err });
          }
          if (!ret) {
            reject({ code: 400, message: "Invalid Data" });
          }
          resolve(msg);
        });
      });
    });
  });
};

sessionSchema.statics.loadRefresh = function (
  sessionID,
  clientRefreshToken,
  clientAccessToken
) {
  //Valid?
  return new Promise((resolve, reject) => {
    jwt.verify(clientRefreshToken, process.env.TOKEN_SECRET, (err, payload) => {
      if (err) {
        reject({ code: 400, message: "Invalid Token", err: err });
      }

      if (payload.clientAccessToken != clientAccessToken) {
        reject({ code: 400, message: "Invalid Refresh", err: err });
      }
      //Have?
      return this.findOne({ sessionID }).then((msg) => {
        if (!msg) {
          reject({ code: 400, message: "Invalid Data" });
        }

        //Match?
        let refreshToken = msg.refreshToken;
        bcrypt.compare(clientRefreshToken, refreshToken, (err, ret) => {
          if (err) {
            console.log(err);
            reject({ code: 400, message: err });
          }
          if (!ret) {
            reject({ code: 400, message: "Invalid Data" });
          }
          resolve(msg);
        });
      });
    });
  });
};

module.exports = sessionSchema;
