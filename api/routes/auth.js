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
  let data = req.body;

  let sendingData = new Credential({
    username: data.username,
    credentials: data.password,
  });

  sendingData
    .save()
    .then((msg) => {
      res.send({ code: 200 });
      console.log("User Registered: ", data.username);
    })
    .catch((err) => {
      console.log(err);
      res.send({ code: 400, err: err });
    });
});

router.post("/login", (req, res, next) => {
  let data = req.body;

  userSchema
    .login(data.username, data.password)
    .then((msg) => {
      Session.static
        .tokenSign(msg.credentials, data.unique)
        .then((_accessTokens_) => {
          let accessTokens = _accessTokens_;

          Session.static
            .refreshSign(msg.credentials, data.unique)
            .then((_refreshTokens_) => {
              let refreshTokens = _refreshTokens_;
              //We might replace this in the future
              let sessionID = crypto.randomUUID();

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
                    username: data.username,
                    sessionID: sessionID,
                    accessToken: accessTokens.clientAccessToken,
                    refreshToken: refreshTokens.clientRefreshToken,
                  });
                  console.log("Token Created");
                })
                .catch((err) => {
                  console.log(err);
                  res.send({ code: 400, err: err });
                });
            })
            .catch((rferr) => {
              res.send({ code: 400, err: "AccessTokenError", details: rferr });
            });
        })
        .catch((acerr) => {
          res.send({ code: 400, err: "AccessTokenError", details: acerr });
        });
    })
    .catch((err) => {
      res.send({ code: 400, err: err });
    });
});

router.get("/", function (req, res, next) {
  res.send("Authentication API");
});

module.exports = router;
