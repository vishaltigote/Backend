const config = require("../config");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// const randomstring = require("randomstring");
// const fs = require("fs");
// const { errorHandler } = require("./error");
// const AWS = require("aws-sdk");
// const sql = require("mssql");

/**
 * Function for Encrypting the password
 * @param {*} data (data to encrypt)
 * @param {*} return (encrypted data)
 */
function encryptPassword(data) {
  var response = CryptoJS.AES.encrypt(data, config.tokenkey);
  return response.toString();
}

/**
 * Function for decrypting the password
 * @param {*} data (data to decrypt)
 * @param {*} return (decrypt data)
 */
function decryptPassword(data) {
  var decrypted = CryptoJS.AES.decrypt(data, config.tokenkey);
  if (decrypted) {
    var userinfo = decrypted.toString(CryptoJS.enc.Utf8);
    return userinfo;
  } else {
    return { userinfo: { error: "Please send proper token" } };
  }
}

/**
 * Function for encryting the userId with session
 * @param {*} data (data to encrypt)
 * @param {*} return (encrypted data)
 */
async function tokenEncrypt(data) {
  var token = await jwt.sign({ data: data }, config.tokenkey, {
    expiresIn: 24 * 60 * 60,
  }); // Expires in 1 day
  return token;
}

/**
 * Function for decryting the userId with session
 * @param {*} data (data to decrypt)
 * @param {*} return (decrypted data)
 */
async function tokenDecrypt(data) {
  try {
    const decode = await jwt.verify(data, config.tokenkey);
    return decode;
  } catch (error) {
    return error;
  }
}

module.exports = {
  encryptPassword,
  decryptPassword,
  tokenEncrypt,
  tokenDecrypt,
};
