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
sessionSchema.static.tokenSign = (credentials, unique) => {
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
sessionSchema.static.refreshSign = (accessToken, credentials, unique) => {
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
sessionSchema.static.loadAccess = (sessionID, clientAccessToken) => {
  //Valid?
  jwt.verify(clientAccessToken, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      return Promise.reject({ code: 400, message: "Invalid Token", err: err });
    }
    //Have?
    return this.findOne({ sessionID }).then((msg) => {
      if (!msg) {
        return Promise.reject({ code: 400, message: "Invalid Data" });
      }

      //Match?
      return new Promise((resolve, reject) => {
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

sessionSchema.static.loadRefresh = (
  sessionID,
  clientRefreshToken,
  clientAccessToken
) => {
  //Valid?
  jwt.verify(clientRefreshToken, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      return { code: 400, message: "Invalid Token", err: err };
    }

    if (payload.clientAccessToken != clientAccessToken) {
      return { code: 400, message: "Invalid Refresh", err: err };
    }
    //Have?
    return this.findOne({ sessionID }).then((msg) => {
      if (!msg) {
        return Promise.reject({ code: 400, message: "Invalid Data" });
      }

      //Match?
      return new Promise((resolve, reject) => {
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
