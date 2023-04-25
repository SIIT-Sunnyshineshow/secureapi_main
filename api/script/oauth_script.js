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
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(OACCESS_KEY, "hex"),
    iv
  );
  let rawToken = {
    user_id,
    secret,
  };

  let message = JSON.stringify(rawToken);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");

  return jwt.sign(
    { OAccessToken: encrypted, iv: iv.toString("hex") },
    OACCESS_JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

function generateORefresh(OAccessToken, user_id, secret) {
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(OREFRESH_KEY, "hex"),
    iv
  );
  let rawToken = {
    user_id,
    secret,
    OAccessToken,
  };
  let message = JSON.stringify(rawToken);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");

  return jwt.sign(
    { ORefreshToken: encrypted, iv: iv.toString("hex") },
    OREFRESH_JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function validateORefresh(
  ORefreshToken,
  OAccessToken,
  user_id,
  appdata,
  channel_access
) {
  return new Promise((resolve, reject) => {
    if (!ORefreshToken) {
      reject({ code: 401, err: "Please Login Again" });
    }
    jwt.verify(ORefreshToken, OREFRESH_JWT_SECRET, (err, payload) => {
      if (err) {
        reject({ code: 401, err: "Please Login Again" });
      }
      let decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(OREFRESH_KEY, "hex"),
        Buffer.from(payload.iv, "hex")
      );
      let decrypted = decipher.update(payload.ORefreshToken, "hex", "utf8");
      decrypted += decipher.final("utf8");

      let rawToken = JSON.parse(decrypted);

      if (rawToken.user_id != user_id) {
        reject({ code: 401, err: "Who are you?" });
      }

      if (rawToken.OAccessToken != OAccessToken) {
        reject({ code: 403, err: "Invalid uses of refresh token" });
      }

      let rawSecret = decSecret(rawToken.secret, channel_access);

      if (rawSecret.app_id != appdata.app_id) {
        reject({ code: 403, err: "Forbidden use of application, ORefresh" });
      }

      for (let i in rawSecret.attributes) {
        if (!appdata.attributes.includes(rawSecret.attributes[i])) {
          reject({ code: 403, err: "Forbidden use of permission" });
        }
      }

      resolve({ code: 200, secret: rawToken.secret });
    });
  });
}

function validateOAccess(OAccessToken, user_id, appdata, channel_access) {
  //Valid?
  return new Promise((resolve, reject) => {
    if (!OAccessToken) {
      reject({ code: 401, err: "Please Login Again" });
    }
    jwt.verify(OAccessToken, OACCESS_JWT_SECRET, (err, payload) => {
      if (err) {
        //Validate ORefresh
        //if it's available, Refresh the Token
        //Duty of Express
        resolve({ code: 240 });
      }

      let decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(OACCESS_KEY, "hex"),
        Buffer.from(payload.iv, "hex")
      );
      let decrypted = decipher.update(payload.OAccessToken, "hex", "utf8");
      decrypted += decipher.final("utf8");

      let rawToken = JSON.parse(decrypted);

      if (rawToken.user_id != user_id) {
        reject({ code: 401, err: "Who are you?" });
      }

      // console.log(channel_access);
      // console.log(rawToken);

      let rawSecret = decSecret(rawToken.secret, channel_access);
      // console.log(rawSecret);

      if (rawSecret.app_id != appdata.app_id) {
        reject({ code: 403, err: "Forbidden use of application, OAccess" });
      }

      for (let i in rawSecret.attributes) {
        console.log(rawSecret.attributes[i]);
        console.log(appdata);
        if (!appdata.attributes.includes(rawSecret.attributes[i])) {
          reject({ code: 403, err: "Forbidden use of permission" });
        }
      }

      resolve({ code: 200, secret: rawToken.secret });
    });
  });
}

function generateOTokens(user_id, secret) {
  let OAccessTokenSet = generateOAccess(user_id, secret);
  let ORefreshTokenSet = generateORefresh(
    OAccessTokenSet.OAccessToken,
    user_id,
    secret
  );

  return { OAccessTokenSet, ORefreshTokenSet };
}

function checkOTokens(OTokens, appdata, user_id, channel_access) {
  return new Promise((resolve, reject) => {
    let OAccessTokenSet = OTokens.OAccessTokenSet;
    let ORefreshTokenSet = OTokens.ORefreshTokenSet;
    //TODO Decrypt Secret First
    validateOAccess(OAccessTokenSet, user_id, appdata, channel_access)
      .then((res) => {
        if (res.code == 200) {
          resolve({ code: 200, secret: res.secret });
        } else if (res.code == 240) {
          //TODO Decrypt Secret First
          validateORefresh(
            ORefreshTokenSet,
            OAccessTokenSet,
            user_id,
            appdata,
            channel_access
          )
            .then((refres) => {
              if (refres.code == 200) {
                let tokenSet = generateOTokens(user_id, refres.secret);
                resolve({
                  code: 240,
                  tokenSet: tokenSet,
                  secret: refres.secret,
                });
              } else {
                reject({ code: 400, err: "Error in validateOAccess" });
              }
            })
            .catch((referr) => {
              console.log("Error A");
              reject(referr);
            });
        }
      })
      .catch((err) => {
        console.log("Error B");
        reject({ code: 401, err: err });
      });
  });
}

module.exports = {
  generateOAccess,
  generateORefresh,
  validateOAccess,
  validateORefresh,
  generateOTokens,
  checkOTokens,
};
