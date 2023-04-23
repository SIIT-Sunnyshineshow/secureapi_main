var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { encSecret, decSecret } = require("../script/secret_cbc");
dotenv.config();

const crypto = require("crypto");

const secretKey = process.env.GENERATOR_KEY;

router.post("/generate", (req, res, next) => {
  let data = req.body;

  let secretData = encSecret(data.attributes, data.app_id);

  res.send({ code: 200, data: secretData.encrypted, iv: secretData.iv });
});

router.post("/checkrole", (req, res, next) => {
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
