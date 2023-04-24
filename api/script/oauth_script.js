const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { encSecret, decSecret } = require("./secret_cbc");

const OACCESS_JWT_SECRET = process.env.OACCESS_JWT_SECRET;
const OREFRESH_JWT_SECRET = process.env.OREFRESH_JWT_SECRET;
const OACCESS_KEY = process.env.OACCESS_KEY;
const OREFRESH_KEY = process.env.OREFRESH_KEY;

function generateOAccess(user_id, secret) {
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv("aes-256-cbc", OACCESS_KEY, iv);
  let rawToken = {
    user_id,
    secret,
  };
  let message = JSON.stringify(rawToken);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");

  return jwt.sign({ OAccessToken: encrypted, iv: iv }, OACCESS_JWT_SECRET, {
    expiresIn: "1d",
  });
}

function generateORefresh(OAccessToken, user_id, secret) {
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv("aes-256-cbc", OREFRESH_KEY, iv);
  let rawToken = {
    user_id,
    secret,
    OAccessToken,
  };
  let message = JSON.stringify(rawToken);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");

  return jwt.sign({ ORefreshToken: encrypted, iv: iv }, OREFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });
}

function validateOAccess(OAccessToken, user_id) {
  //Valid?
  jwt.verify(OAccessToken, OACCESS_JWT_SECRET, (err, payload) => {
    if (err) {
      //Validate ORefresh
      //if it's available, Refresh the Token
    }

    let decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      OACCESS_KEY,
      payload.iv
    );
    let decrypted = decipher.update(payload.OAccessToken, "hex", "utf8");
    decrypted += decipher.final("utf8");

    let rawToken = JSON.parse(decrypted);

    if (rawToken.user_id != user_id) {
      return { code: 401, err: "Who are you?" };
    }

    return decSecret();
  });

  //Match?
}
