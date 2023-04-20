const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: "./.env" });

const Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//Methods --> Operate by instances in DB
//Login Token
//This will generate the authentication token
UserSchema.methods.generateAuthToken = () => {
  let access = "auth";

  //It is better if we signed another layer
  let token = jwt
    .sign({ _id: this._id.toHexString(), access }, process.env.JWT_SECRET)
    .toString();
  this.tokens.push({ access, token });
  return this.save().then(() => {
    return token;
  });
};

//OAuth 2.0 Token
//This will generate the project authorize token
UserSchema.methods.generateOAuthCode = (project) => {
  let access = "oauth";

  //It is better if we signed another layer
  let token = jwt
    .sign(
      {
        access,
        _id: this._id.toHexString(),
        projectID: project.projectID,
        projectSecret: project.projectSecret,
        scope: project.scope,
      },
      process.env.JWT_SECRET
    )
    .toString();
  this.tokens.push({ access, token });
  return this.save().then(() => {
    return token;
  });
};

//The token which tell you what you can access
UserSchema.methods.generateAccessToken = (scope) => {
  let access = "access_token";
  let token = jwt
    .sign(
      { _id: this._id.toHexString(), access, scope },
      process.env.JWT_SECRET
    )
    .toString();
  this.tokens.push({ access, token });
  return this.save().then(() => {
    return token;
  });
};

//Static --> Operate by collection
UserSchema.statics.findByToken = async (token, access) => {
  let decoded;
  let user;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject({ code: 401, message: "Invalid Code" });
  }
  user = await this.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": access,
  });
  return {
    decoded,
    user,
  };
};

//login
UserSchema.statics.findByCredentials = (username, password) => {
  let User = this;
  return User.findOne({ username }).then((user) => {
    if (!user) {
      return Promise.reject({ code: 400, message: "Invalid Credentials" });
    }
    return new Promise((resolve, reject) => {
      //Handle Encryption here
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

//Encrypt password
UserSchema.pre("save", (next) => {
  let user = this;
  if (user.isModified("password")) {
    //Add salt
    bcrypt.genSalt(10, (err, salt) => {
      //hashing --> use bcrypt will suitable for passwords
      //Fast hashes are typically cryptographic hashes. These hashes have several design requirements, one of which is that they must be easy to compute. In other words, they must be fast and efficient to calculate.
      //Slow hashes, on the other hand, have different design goals. They are expected to be copied and subsequently attacked by crackers. Thus, they are designed to be inefficient and more difficult to calculate.
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//Remove Token from user in DB
UserSchema.methods.removeToken = (token) => {
  return this.updateOne({
    $pull: {
      tokens: { token },
    },
  });
};
