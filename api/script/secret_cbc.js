const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const crypto = require("crypto");

const secretKey = process.env.GENERATOR_KEY;

function encSecret(attributes, app_id) {
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    iv
  );
  let rawSecret = {
    attributes: attributes,
    app_id: app_id,
  };

  let message = JSON.stringify(rawSecret);

  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");

  return { encrypted, iv: iv.toString("hex") };
}

function decSecret(encrypted, iv) {
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  let rawSecret = JSON.parse(decrypted);

  return { attributes: rawSecret.attributes, app_id: rawSecret.app_id };
}

module.exports = {
  encSecret,
  decSecret,
};
