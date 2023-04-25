var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { encSecret, decSecret } = require("../script/secret_cbc");
dotenv.config();
const secureHeader = require("../script/secure_headers");

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

router.post("/generate", (req, res, next) => {
  /* Required attributes and app_id*/
  let data = req.body;

  let secretData = encSecret(data.attributes, data.app_id);

  res.send({ code: 200, data: secretData.encrypted, iv: secretData.iv });
});

router.post("/checkrole", (req, res, next) => {
  /** required encrypted and iv */
  let data = req.body;

  let rawSecret = decSecret(data.encrypted, data.iv);

  res.send({
    code: 200,
    attributes: rawSecret.attributes,
    app_id: rawSecret.app_id,
  });
});

router.get("/test", function (req, res, next) {
  res.send({ message: "Generator API" });
});

module.exports = router;
