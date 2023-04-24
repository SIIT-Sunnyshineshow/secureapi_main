var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var secureHeader = require("../script/secure_headers");
const crypto = require("crypto");

const AppSchema = require("../model/applistModel");
const AppList = mongoose.model("applist", AppSchema, "applist");

const ApiSchema = require("../model/apiModel");
const ApiList = mongoose.model("apilist", ApiSchema, "apilist");

/* GET users listing. */

router.use((req, res, next) => {
  secureHeader(req, res, next)
    .then((payload) => {
      if (payload.code == 200) {
        next();
      } else if (payload.code == 240) {
        //TODO Refresh and put it back into the header
        res.append("accessToken", payload.accessToken);
        res.append("refreshToken", payload.refreshToken);
        next();
      } else {
        res.send({ code: 401, err: "Unauthorized Usage" });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/test", function (req, res, next) {
  res.send("APPLIST API");
});

//Foreign App Checker Should be in the decoy app HERE
//Check the from app, then the scope

router.post("/addapp", (req, res, next) => {
  let data = req.body;

  let sendingData = new AppList({
    appName: data.appName,
    user_id: data.user_id,
    loginApi: data.loginApi,
    callbackLoginApi: data.cbLogin,
    apis: [],
    attributes: [],
    appSecretKey: crypto.randomBytes(32).toString("hex"),
  });

  sendingData.save((err, result) => {
    if (err) {
      res.send({ code: 500, err: err });
    } else {
      res.send({ code: 200 });
    }
  });
});

router.post("/getapp", (req, res, next) => {
  let data = req.body;

  AppList.find({ user_id: data.user_id }, (err, docs) => {
    if (err) {
      res.send({ code: 400, err: err });
    }
    res.send({ code: 200, payload: docs });
  });
});

router.post("/getoneapp", (req, res, next) => {
  let data = req.body;

  AppList.find({ _id: new mongoose.Types.ObjectId(data._id) }, (err, docs) => {
    if (err) {
      res.send({ code: 400, err: err });
    }
    res.send({ code: 200, payload: docs });
  });
});

router.post("/addapi", (req, res, next) => {
  let data = req.body;

  let sendingData = new ApiList({
    apiName: data.apiName,
    app_id: data.app_id,
    user_id: data.user_id,
    apiLink: crypto.createHash("sha256").update(data.apiLink).digest("hex"),
    apiPriLink: data.apiLink,
    apiMethod: data.apiMethod,
    allowedAttributes: data.allowedAttributes,
  });

  sendingData.save((err, result) => {
    if (err) {
      res.send({ code: 500, err: err });
    } else {
      res.send({ code: 200 });
    }
  });
});

router.post("/getapi", (req, res, next) => {
  let data = req.body;

  ApiList.find({ user_id: data.user_id, app_id: data.app_id }, (err, docs) => {
    if (err) {
      res.send({ code: 400, err: err });
    }
    res.send({ code: 200, data: docs });
  });
});

router.post("/getoneapi", (req, res, next) => {
  let data = req.body;

  ApiList.find({ _id: new mongoose.Types.ObjectId(data._id) }, (err, docs) => {
    if (err) {
      res.send({ code: 400, err: err });
    }
    res.send({ code: 200, data: docs });
  });
});

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
