var express = require("express");
var router = express.Router();

const jwt = require("jsonwebtoken");
require("dotenv").config();

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const sessionSchema = require("../model/sessionModel");

//Header Checker
function secureHeader(req, res, next) {
  return Promise((resolve, reject) => {
    //Check Access Token
    //Redirect to login page for 403
    let clientAccessToken = req.headers.accessToken;
    let clientRefreshToken = req.headers.refreshToken;
    let sessionID = req.headers.sessionID;

    if (!sessionID) {
      reject({ code: 403, err: "No Session ID detected" });
    }
    if (!clientAccessToken) {
      reject({ code: 403, err: "No Access Token detected" });
    }
    if (!clientRefreshToken) {
      reject({ code: 403, err: "No Refresh Token detected" });
    }

    sessionSchema
      .loadAccess(sessionID, clientAccessToken)
      .then((acres) => {
        resolve({ code: 200 });
      })
      .catch((err) => {
        sessionSchema.static
          .loadRefresh(sessionID, clientRefreshToken)
          .then((rfres) => {
            //JWT Decode
            jwt.verify(
              clientRefreshToken,
              process.env.TOKEN_SECRET,
              (err, payload) => {
                if (err) {
                  reject({
                    code: 403,
                    err: "Abnormal Refresh Token or expires",
                  });
                }
                sessionSchema
                  .tokenSign(payload.credentials, payload.unique)
                  .then((_accessTokens_) => {
                    let accessTokens = _accessTokens_;

                    sessionSchema
                      .refreshSign(payload.credentials, payload.unique)
                      .then((_refreshTokens_) => {
                        let refreshTokens = _refreshTokens_;

                        let filter = { sessionID: sessionID };

                        let update = {
                          accessToken: accessTokens.accessToken,
                          refreshToken: refreshTokens.refreshToken,
                        };

                        sessionSchema
                          .findOneAndUpdate(filter, update)
                          .then((res) => {
                            resolve({
                              code: 240,
                              accessToken: accessTokens.clientAccessToken,
                              refreshToken: refreshTokens.clientRefreshToken,
                            });
                          })
                          .catch((err) => {
                            reject({
                              code: 500,
                              err: "Abnormal Database Status",
                            });
                          });
                      })
                      .catch((err) => {
                        reject({ code: 500, err: "Abnormal Token Fetch" });
                      });
                  })
                  .catch((err) => {
                    reject({ code: 500, err: "Abnormal Token Fetch" });
                  });
              }
            );
          })
          .catch((err) => {
            reject({ code: 403, err: "Invalid Session, please login again" });
          });
      });
  });
}

module.exports = secureHeader;
