const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: "./.env" });

const Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  credentials: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Register Password Hash
userSchema.pre("save", function (next) {
  if (this.isModified("credentials")) {
    bcrypt.genSalt(10, (err, salt) => {
      let rawCred = this.username + this.credentials;
      bcrypt.hash(rawCred, salt, (err, hash) => {
        this.credentials = hash;
        //console.log("LOGINPASS: " + hash);
        next();
      });
    });
  } else {
    next();
  }
});

//Login and check credentials
//This kind of function definition is a must
//Arrow function might cause problems in function definition
userSchema.statics.login = function (username, credentials) {
  if (!username) {
    return Promise.reject({ code: 400, message: "Invalid Username" });
  }

  if (!credentials) {
    return Promise.reject({ code: 400, message: "Invalid Credential" });
  }
  return this.findOne({ username }).then((msg) => {
    if (!msg) {
      console.log("LOGIN -> Invalid Data in Database");
      return Promise.reject({ code: 400, message: "Invalid Data" });
    }

    return new Promise((resolve, reject) => {
      //console.log(credentials + " " + msg.credentials);
      bcrypt.compare(username + credentials, msg.credentials, (err, res) => {
        //console.log(res);
        if (res) {
          resolve(msg);
        } else {
          reject({ code: 400, err: "Bcrypt imcomparable" });
        }
      });
    });
  });
};

// userSchema.static.signCredentials = (username, password) => {
//   let rawCredentials = username + password;

//   bcrypt.getSalt(10, (err, salt) => {
//     if (err) {
//       return 0;
//     }
//     bcrypt.hash(rawCredentials, salt, (err, hash) => {
//       if (err) {
//         return 0;
//       }
//       return hash;
//     });
//   });
// };

module.exports = userSchema;
