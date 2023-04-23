var express = require("express");
var router = express.Router();
const Schema = mongoose.Schema;
const sessionSchema = require("../model/sessionModel");
var secureHeader = require("../script/secure_headers");

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

router.get("/hello", function (req, res, next) {
  res.send("Hello");
});

router.post("/getapp", (req, res, next) => {
  let data = req.body;
});

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
