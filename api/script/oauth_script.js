const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { encSecret, decSecret } = require("./secret_cbc");

const OACCESS_JWT_SECRET = process.env.OACCESS_JWT_SECRET;
const OREFRESH_JWT_SECRET = process.env.OREFRESH_JWT_SECRET;
const OACCESS_KEY = process.env.OACCESS_KEY;
const OREFRESH_KEY = process.env.OREFRESH_KEY;

//Appdata contains Attributes and App_id from Database

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

function validateORefresh(ORefreshToken, OAccessToken, user_id, appdata, iv) {
  if (!ORefreshToken) {
    return { code: 401, err: "Please Login Again" };
  }
  jwt.verify(ORefreshToken, OREFRESH_JWT_SECRET, (err, payload) => {
    if (err) {
      return { code: 401, err: "Please Login Again" };
    }
    let decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      OREFRESH_KEY,
      payload.iv
    );
    let decrypted = decipher.update(payload.ORefreshToken, "hex", "utf8");
    decrypted += decipher.final("utf8");

    let rawToken = JSON.parse(decrypted);

    if (rawToken.user_id != user_id) {
      return { code: 401, err: "Who are you?" };
    }

    if (rawToken.OAccessToken != OAccessToken) {
      return { code: 403, err: "Invalid uses of refresh token" };
    }

    let rawSecret = decSecret(rawToken.secret, iv);

    if (
      rawSecret.app_id != rawToken.app_id ||
      rawSecret.app_id != appdata.app_id
    ) {
      return { code: 403, err: "Forbidden use of application" };
    }

    for (let i in rawSecret.attributes) {
      if (!appdata.attributes.includes(i)) {
        return { code: 403, err: "Forbidden use of permission" };
      }
    }

    return { code: 200, secret: rawToken.secret };
  });
}

function validateOAccess(OAccessToken, user_id, appdata, iv) {
  //Valid?
  if (!OAccessToken) {
    return { code: 401, err: "Please Login Again" };
  }
  jwt.verify(OAccessToken, OACCESS_JWT_SECRET, (err, payload) => {
    if (err) {
      //Validate ORefresh
      //if it's available, Refresh the Token
      //Duty of Express
      return { code: 240 };
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

    let rawSecret = decSecret(rawToken.secret, iv);

    if (
      rawSecret.app_id != rawToken.app_id ||
      rawSecret.app_id != appdata.app_id
    ) {
      return { code: 403, err: "Forbidden use of application" };
    }

    for (let i in rawSecret.attributes) {
      if (!appdata.attributes.includes(i)) {
        return { code: 403, err: "Forbidden use of permission" };
      }
    }

    return { code: 200 };
  });
}

function generateOTokens(user_id, secret) {
  let OAccessTokenSet = generateOAccess(user_id, secret);
  let ORefreshTokenSet = generateORefresh(OAccessToken, user_id, secret);

  return { OAccessTokenSet, ORefreshTokenSet };
}

function checkOTokens(OTokens, appdata, user_id) {
  let OAccessTokenSet = OTokens.OAccessTokenSet;
  let ORefreshTokenSet = OTokens.ORefreshTokenSet;

  let res = validateOAccess(
    OAccessTokenSet.OAccessToken,
    user_id,
    appdata,
    OAccessTokenSet.iv
  );

  if (res.code == 200) {
    return { code: 200 };
  } else if (res.code == 240) {
    let refres = validateORefresh(
      ORefreshTokenSet.ORefreshToken,
      OAccessTokenSet.OAccessToken,
      user_id,
      appdata,
      ORefreshTokenSet.iv
    );

    if (refres.code == 200) {
      let tokenSet = generateOTokens(user_id, refres.secret);
      return { code: 240, tokenSet: tokenSet, secret: refres.secret };
    } else {
      return { code: refres.code };
    }
  } else {
    return res;
  }
}

module.exports = {
  generateOAccess,
  generateORefresh,
  validateOAccess,
  validateORefresh,
  generateOTokens,
  checkOTokens,
};
