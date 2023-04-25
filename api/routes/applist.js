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
/*
Requirement for headers
accessToken,
refreshToken,
sessionID

*/

String.prototype.toObjectId = function () {
  var ObjectId = require("mongoose").Types.ObjectId;
  return new ObjectId(this.toString());
};

//Secure Header
router.use((req, res, next) => {
  secureHeader(req, res, next)
    .then((payload) => {
      if (payload.code == 200) {
        next();
      } else if (payload.code == 240) {
        res.set({
          tokenedit: 240,
          accesstoken: payload.accessToken,
          refreshtoken: payload.refreshToken,
        });
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
  /* Example Request
  {
    "appName": "Somchart App ma fav",
    "user_id": "6446d9ce3cb6ae24ab201455",
    "loginApi" : "www.google.com",
    "cbLogin" : "www.google.com"

  }
  */
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

  sendingData
    .save()
    .then((resp) => {
      res.send({ code: 200 });
    })
    .catch((err) => {
      res.send({ code: 500, err: err });
    });
});

router.post("/updateapp", (req, res, next) => {
  let data = req.body;
  let app_id = data.app_id;

  /* 
  Required Info
  update = {
    appName: data.appName,
    app_id: app_id
    user_id: user_id,
    loginApi: data.loginApi,
    callbackLoginApi: data.cbLogin,
    attributes: data.attributes,
  };

  */

  //TODO
  let _id = new mongoose.Types.ObjectId(app_id);
  let filter = {
    _id: _id,
    user_id: data.user_id,
  };

  let update = {};

  if (data.appName) {
    update.appName = data.appName;
  }

  if (data.loginApi) {
    update.loginApi = data.loginApi;
  }

  if (data.cbLogin) {
    update.callbackLoginApi = data.cbLogin;
  }

  if (data.attributes) {
    update.attributes = data.attributes;
  }

  update = {
    appName: data.appName,
    loginApi: data.loginApi,
    callbackLoginApi: data.cbLogin,
    attributes: data.attributes,
  };

  console.log(filter);

  AppList.findOneAndUpdate(filter, update)
    .then((docs) => {
      res.send({ code: 200, docs_old: docs });
    })
    .catch((error) => {
      res.send({ code: 400, err: error });
    });
});

router.post("/getapp", (req, res, next) => {
  //Require User_id
  let data = req.body;

  AppList.find({ user_id: data.user_id })
    .then((docs) => {
      res.send({ code: 200, payload: docs });
    })
    .catch((err) => {
      res.send({ code: 400, err: err });
    });
});

router.post("/getoneapp", (req, res, next) => {
  let data = req.body;

  AppList.find({ _id: new mongoose.Types.ObjectId(data._id) })
    .then((docs) => {
      res.send({ code: 200, payload: docs });
    })
    .catch((err) => {
      res.send({ code: 400, err: err });
    });
});

router.post("/addapi", (req, res, next) => {
  /*
  {
    "apiName": "TestAPI",
    "app_id": "64474a8c93f3740ffbf6585c",
    "user_id" : "6446d9ce3cb6ae24ab201455",
    "apiLink": "https://api.imgflip.com/get_memes",
    "allowedAttributes": ["Student"]
}
  */
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

  sendingData
    .save()
    .then((docs) => {
      res.send({ code: 200, docs });
    })
    .catch((err) => {
      res.send({ code: 500, err: err });
    });
});

router.post("/getapi", (req, res, next) => {
  let data = req.body;
  /*
  Required 
    user_id,
    app_id
   */
  ApiList.find({ user_id: data.user_id, app_id: data.app_id })
    .then((docs) => {
      res.send({ code: 200, data: docs });
    })
    .catch((err) => {
      res.send({ code: 400, err: err });
    });
});

router.post("/getoneapi", (req, res, next) => {
  let data = req.body;

  ApiList.find({ _id: new mongoose.Types.ObjectId(data._id) })
    .then((docs) => {
      res.send({ code: 200, data: docs });
    })
    .catch((err) => {
      res.send({ code: 400, err: err });
    });
});

router.get("/test", (req, res, next) => {
  res.send("APP LIST API");
});

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
