var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AppSchema = require("../model/applistModel");
const ApiSchema = require("../model/apiModel");
const { decSecret } = require("../script/secret_cbc");

var AppList = mongoose.model("applist", AppSchema, "applist");
var ApiList = mongoose.model("apilist", ApiSchema, "apilist");

/* GET users listing. */

router.get("/loginapi/:appId", (req, res, next) => {
  let app_id = req.query.appId;

  AppList.findOne({ _id: mongoose.Types.ObjectId(app_id) }, (err, docs) => {
    if (err) {
      res.send({ code: 400, err: err });
    } else {
      let loginData = {
        loginApi: docs.loginApi,
        callbackLoginApi: docs.callbackLoginApi,
      };

      res.send({ code: 200, data: loginData });
    }
  });
});

router.post("/verifypermission", (req, res, next) => {
  let data = req.body;
  let rawSecret = decSecret(data.encrypted, data.iv);

  let attributes = rawSecret.attributes;

  //Handler for Safety
  AppList.findOne({ _id: mongoose.Types.ObjectId(app_id) }, (err, docs) => {
    if (err) {
      res.send({ code: 400, err: err });
    } else {
      for (let i in attributes) {
        if (!docs.attributes.includes(i)) {
          res.send({ code: 403, err: err });
        }
      }
      res.send({ code: 200, permission: attributes });
    }
  });
});

router.get("/test", function (req, res, next) {
  res.send("OAuth API");
});

module.exports = router;
