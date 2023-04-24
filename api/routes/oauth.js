import axios from "axios";
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
router.get("/oapi/get/:apiid", (req, res, next) => {
  /* Required from users
  headers: OAccessToken, ORefreshToken, Aiv, Riv, app_id, user_id

   */

  let OAccessToken = req.headers.OAccessToken;
  let ORefreshToken = req.headers.ORefreshToken;
  let Aiv = req.headers.aiv;
  let Riv = req.headers.Riv;
  let app_id = req.headers.app_id;
  let user_id = req.headers.user_id;

  let OAccessTokenSet = { OAccessToken, iv: Aiv };
  let ORefreshTokenSet = { ORefreshToken, iv: Riv };

  AppList.findOne({ _id: mongoose.Types.ObjectId(app_id) }, (err, docs) => {
    if (err) {
      res.send({ code: 400, err: err });
    }

    let appdata = {
      app_id: app_id,
      attributes: docs.attributes,
    };

    let OTokens = {
      OAccessTokenSet,
      ORefreshTokenSet,
    };

    let sendingData = checkOTokens(OTokens, appdata, user_id);

    if (sendingData.code == 240) {
      OTokens = sendingData.tokenSet;

      OAccessToken = OTokens.OAccessTokenSet.OAccessToken;
      ORefreshToken = OTokens.ORefreshTokenSet.ORefreshToken;
      Aiv = OTokens.OAccessTokenSet.iv;
      Riv = OTokens.ORefreshTokenSet.iv;

      res.set({
        changeToken: "240",
        OAccessToken: OAccessToken,
        ORefreshToken: ORefreshToken,
        Aiv: Aiv,
        Riv: Riv,
      });
    } else if (sendingData.code != 200) {
      res.send(sendingData);
    }

    //API actual fetch
    let apiid = req.params.apiid;

    ApiList.findOne({ apiLink: apiid }, (err, docs) => {
      let api_link = docs.apiPriLink;
      let secret = sendingData.secret;

      let apiAttributes = decSecret(secret);

      for (let i in docs.allowedAttributes) {
        if (!apiAttributes.includes(i)) {
          res.send({ code: 403, err: "Invalid Permission" });
        }
      }

      axios
        .get(api_link)
        .then((response) => {
          res.send({ code: 200, data: response.data });
        })
        .catch((error) => {
          res.send({ code: 400, err: error });
        });
    });
  });
});

router.get("/test", function (req, res, next) {
  res.send("OAuth API");
});

module.exports = router;
