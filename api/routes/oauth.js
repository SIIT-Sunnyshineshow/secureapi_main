var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AppSchema = require("../model/applistModel");
const ApiSchema = require("../model/apiModel");
const { decSecret } = require("../script/secret_cbc");
const { generateOTokens, checkOTokens } = require("../script/oauth_script");

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

router.post("/gettokens", (req, res, next) => {
  let user_id = req.body.user_id;
  let secret = req.body.permission;

  let OTokens = generateOTokens(user_id, secret);
  let OAccessTokenSet = OTokens.OAccessTokenSet;
  let ORefreshTokenSet = OTokens.ORefreshTokenSet;
  res.send({ code: 200, OAccessTokenSet, ORefreshTokenSet });
});

router.post("/checktokens", (req, res, next) => {
  /* Incoming will be...
  {
    OAccessTokenSet : {
      OAccessToken
      iv
    },
    ORefreshTokenSet : {
      ORefresh,
      iv
    },
    user_id,
    app_id
  }
  */
  AppList.findOne({ _id: mongoose.Types.ObjectId(app_id) }, (err, docs) => {
    let appdata = {
      app_id: app_id,
      attributes: docs.attributes,
    };

    let OTokens = {
      OAccessTokenSet: req.body.OAccessTokenSet,
      ORefreshTokenSet: req.body.ORefreshTokenSet,
    };

    let sendingData = checkOTokens(OTokens, appdata, user_id);

    res.send(sendingData);
  });
});

//API Execution Set

router.get("/test", function (req, res, next) {
  res.send("OAuth API");
});

module.exports = router;
