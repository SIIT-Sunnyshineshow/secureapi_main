const axios = require("axios");
const jwt = require("jsonwebtoken");
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
  let app_id = req.params.appId;
  //console.log("APP ID: " + app_id);

  AppList.findOne({ _id: new mongoose.Types.ObjectId(app_id) })
    .then((docs) => {
      //console.log(docs);
      let loginData = {
        loginApi: docs.loginApi,
        callbackLoginApi: docs.callbackLoginApi,
      };

      res.send({ code: 200, data: loginData });
    })
    .catch((err) => {
      res.send({ code: 400, err: err });
    });
});

router.post("/verifypermission", (req, res, next) => {
  // Required Secret
  let data = req.body;
  let rawSecret = decSecret(data.encrypted, data.iv);

  // console.log(rawSecret);
  let attributes = rawSecret.attributes;

  //Handler for Safety
  AppList.findOne({ _id: new mongoose.Types.ObjectId(rawSecret.app_id) })
    .then((docs) => {
      for (let i in attributes) {
        console.log(docs.attributes);
        console.log(attributes[i]);
        if (!docs.attributes.includes(attributes[i])) {
          res.send({ code: 403, err: "Invalid Permission" });
          return;
        }
      }
      res.send({ code: 200, permission: attributes });
    })
    .catch((err) => {
      res.send({ code: 400, err: err });
    });
});

router.post("/gettokens", (req, res, next) => {
  // Required Client user identity (can be anything telling the uniqueness of the user) and permission secret
  /*
  {
    "user_id": "djay2247",
    "permission": "4567814effcc0f5e91e5de525f61568c8b0b55134726460e3434c1a98f58fe36d9f321a0265322075c59add061088a6b4c776153edd1d5f54869a8a176d05d5c"
} */
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
    app_id,
    channel_access: app_iv
  }
  */

  let data = req.body;
  AppList.findOne({ _id: new mongoose.Types.ObjectId(data.app_id) }).then(
    (docs) => {
      let appdata = {
        app_id: data.app_id,
        attributes: docs.attributes,
      };

      let OTokens = {
        OAccessTokenSet: req.body.OAccessTokenSet,
        ORefreshTokenSet: req.body.ORefreshTokenSet,
      };

      checkOTokens(OTokens, appdata, data.user_id, data.channel_access)
        .then((sendingData) => {
          res.send(sendingData);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  );
  // .catch((err) => {
  //   res.send({ code: 401, err: err });
  // });
});

//API Execution Set
router.get("/oapi/get/:apiid", (req, res, next) => {
  /* Required from users
  headers: OAccessToken, ORefreshToken, Aiv, Riv, app_id, user_id,channel_access
   */

  console.log(req.headers);

  let OTokens = {
    OAccessTokenSet: req.headers.oaccesstoken,
    ORefreshTokenSet: req.headers.orefreshtoken,
  };
  let app_id = req.headers.app_id;
  let user_id = req.headers.user_id;
  let channel_access = req.headers.channel_access;

  AppList.findOne({ _id: new mongoose.Types.ObjectId(app_id) })
    .then((docs) => {
      let appdata = {
        app_id: app_id,
        attributes: docs.attributes,
      };

      checkOTokens(OTokens, appdata, user_id, channel_access)
        .then((sendingData) => {
          let rawSecret = decSecret(sendingData.secret, channel_access);
          if (sendingData.code == 240) {
            OTokens = sendingData.tokenSet;

            res.set({
              changeToken: "240",
              OAccessToken: OTokens.OAccessTokenSet,
              ORefreshToken: OTokens.ORefreshTokenSet,
            });
          }
          //API actual fetch
          let apiid = req.params.apiid;

          ApiList.findOne({ apiLink: apiid, app_id: app_id }).then((docs) => {
            let api_link = docs.apiPriLink;
            let apiAttributes = rawSecret.attributes;

            for (let i in docs.allowedAttributes) {
              if (!apiAttributes.includes(docs.allowedAttributes[i])) {
                res.send({ code: 403, err: "Invalid Permission" });
                return;
              }
            }

            axios
              .get(api_link)
              .then((response) => {
                res.send({
                  code: 200,
                  channel_access,
                  data: jwt.sign(response.data, channel_access, {
                    expiresIn: "300s",
                  }),
                });
              })
              .catch((error) => {
                res.send({ code: 400, err: error });
              });
          });
          // .catch((err) => {
          //   res.send({ code: 503, err: err });
          // });
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send({ code: 400, err: err });
    });
});

router.get("/test", function (req, res, next) {
  res.send("OAuth API");
});

module.exports = router;
