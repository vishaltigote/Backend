const con = require("../common/database");
const util = require("util");
const query = util.promisify(con.query).bind(con);
const functions = require("../common/functions");

const authenticationController = {
  validateToken: async (req, res, next) => {
    try {
      if (req.headers.auth) {
        const tokenDecryptInfo = await functions.tokenDecrypt(req.headers.auth);

        if (tokenDecryptInfo.data) {
          res.locals.tokenInfo = tokenDecryptInfo.data;
          const token = await functions.tokenEncrypt(tokenDecryptInfo.data);
          res.header("auth", token);
          next();
        } else {
          throw {
            statusCode: 400,
            message: "sessopm expire",
            data: null,
          };
        }
      } else {
        throw {
          statusCode: 500,
          message: "Tokem missing",
          data: null,
        };
      }
    } catch (error) {
      return next(error);
    }
  },

  decryptRequest: (req, res, next) => {
    try {
      if (req.body) {
        const userinfo = functions.decryptData(req.body);
        res.locals.requestedData = userinfo;
        next();
      } else {
        throw {
          statusCode: statusCode.bad_request,
          message: message.badRequest,
          data: null,
        };
      }
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = authenticationController;
