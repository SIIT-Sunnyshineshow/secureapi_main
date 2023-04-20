var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

const userSchema = require("../model/userModel");

const Credential = mongoose.model("Credentials", userSchema, "Credentials");

router.post("/register", function (req, res, next) {
  let data = req.body;

  let sendingData = new Credential({
    username: data.username,
    password: data.password,
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

  let sendingData = new Credential({
    username: data.username,
    password: data.password,
  });

  userSchema
    .login(sendingData.username, sendingData.password)
    .then((msg) => {
      res.send({ code: 200 });
    })
    .catch((err) => {
      res.send({ code: 400, err: err });
    });
});

router.get("/", function (req, res, next) {
  res.send("Authentication API");
});

module.exports = router;
