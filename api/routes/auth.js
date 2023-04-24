var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const userSchema = require("../model/userModel");
const sessionSchema = require("../model/sessionModel");

const Credential = mongoose.model("credentials", userSchema, "credentials");
const Session = mongoose.model("session", sessionSchema, "session");

router.post("/register", function (req, res, next) {
  // Username, Password
  let data = req.body;

  let sendingData = new Credential({
    username: data.username,
    credentials: data.credentials,
  });

  sendingData
    .save()
    .then((msg) => {
      res.send({ code: 200 });
      console.log("User Registered: ", msg._id);
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: 400, err: err });
    });
});

router.post("/login", (req, res, next) => {
  let data = req.body;
  const session = new Session();

  Credential.login(data.username, data.credentials)
    .then((msg) => {
      //console.log(msg);
      let user_id = msg._id.toString();
      Session.tokenSign(msg.credentials, data.unique)
        .then((_accessTokens_) => {
          let accessTokens = _accessTokens_;

          Session.refreshSign(
            accessTokens.clientAccessToken,
            msg.credentials,
            data.unique
          )
            .then((_refreshTokens_) => {
              let refreshTokens = _refreshTokens_;
              //We might replace this in the future
              let sessionID = randomUUID();

              let new_session = new Session({
                username: data.username,
                sessionID: sessionID,
                accessToken: accessTokens.accessToken,
                refreshToken: refreshTokens.refreshToken,
              });

              new_session
                .save()
                .then((msg) => {
                  res.send({
                    code: 200,
                    user_id: user_id,
                    username: data.username,
                    sessionID: sessionID,
                    accessToken: accessTokens.clientAccessToken,
                    refreshToken: refreshTokens.clientRefreshToken,
                  });
                  console.log("Token Created");
                })
                .catch((err) => {
                  console.log(err);
                  console.log("Err section A");
                  res.send({ code: 400, err: err });
                });
            })
            .catch((rferr) => {
              console.log("Err section B");
              res.send({ code: 400, err: "AccessTokenError", details: rferr });
            });
        })
        .catch((acerr) => {
          console.log("Err section C");
          res.send({ code: 400, err: "AccessTokenError", details: acerr });
        });
    })
    .catch((err) => {
      console.log("Err section D");
      res.send({ code: 400, err: err });
    });
});

router.get("/", function (req, res, next) {
  res.send("Authentication API");
});

module.exports = router;
