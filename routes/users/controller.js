const service = require("./service");
const Joi = require("joi");
const functions = require("../../common/functions");

const controller = {
  createUser: async (req, res, next) => {
    try {
      const schema = Joi.object({
        Full_Name: Joi.string().required(),
        Email: Joi.string().email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        }),
        Password: Joi.string().required(),
        City: Joi.string().required(),
      });

      let info = req.body;

      const value = await schema.validateAsync({
        Full_Name: info.Full_Name,
        Email: info.Email,
        Password: info.Password,
        City: info.City,
      });

      // Check email is alread exists in the database or not

      let checkExists = await service.user().checkExists(value.Email);

      if (checkExists) {
        res.status(500).send({
          status: 500,
          message: "Email already exists",
          data: [],
        });
      } else {
        let result = await service.user().createUser(value);

        if (result.flagCheck == false) {
          res.status(500).send({
            status: 500,
            message: "Something went wrong please contact DB admin",
            data: [],
          });
        } else {
          res.status(200).send({
            status: 200,
            message: "User added successfully!!",
            data: [],
          });
        }
      }
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "error",
        data: error.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const schema = Joi.object({
        Email: Joi.string().email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        }),
        Password: Joi.string().required(),
      });

      let info = req.body;
      const value = await schema.validateAsync({
        Email: info.Email,
        Password: info.Password,
      });

      let getResponse = await service.user().login(value);
      let t = await functions.tokenEncrypt(getResponse.data);

      if (getResponse.flagCheck == false) {
        res.status(500).send({
          status: 500,
          message: "Invalid Details",
          data: [],
        });
      } else {
        let token;

        let responseData = {
          userDetails: getResponse.data,
          token: t,
        };
        res.status(200).send({
          status: 200,
          message: "login successfully",
          data: responseData,
        });
      }
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "error",
        data: error,
      });
    }
  },

  addMoments: async (req, res) => {
    try {
      const schema = Joi.object({
        title: Joi.string().required(),
        tags: Joi.array().required(),
        // image_url: Joi.string(),
      });

      let info = req.body;
      const value = await schema.validateAsync({
        title: info.title,
        tags: info.tags,
        // image_url: info.image_url,
      });

      let userDetails = res.locals.tokenInfo;

      // Check email is alread exists in the database or not

      let checkExists = await service.user().checkExists(userDetails.email);
      if (checkExists) {
        let uploadPost = await service
          .user()
          .addMoments(
            value.title,
            JSON.stringify(value.tags),
            info.image_url,
            userDetails.id
          );

        let responseArray = value;
        if (uploadPost.flagCheck == true) {
          res.status(200).send({
            status: 200,
            message: "Added successfully",
            data: responseArray,
          });
        } else {
          res.status(500).send({
            status: 500,
            message: "something went wrong",
            data: responseArray,
          });
        }
      } else {
        res.status(500).send({
          status: 500,
          message: "User not exists",
          data: [],
        });
      }
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "error",
        data: error.message,
      });
    }
  },

  updateMoments: async (req, res) => {
    try {
      const schema = Joi.object({
        title: Joi.string().required(),
        tags: Joi.array().required(),
        image_url: Joi.string().required(),
        moment_id: Joi.number().required(),
      });

      let info = req.body;
      const value = await schema.validateAsync({
        title: info.title,
        tags: info.tags,
        image_url: info.image_url,
        moment_id: info.moment_id,
      });

      let userDetails = res.locals.tokenInfo;

      // Check email is alread exists in the database or not

      let checkExists = await service.user().checkExists(userDetails.email);
      if (checkExists) {
        let uploadPost = await service
          .user()
          .updateMoments(
            value.title,
            JSON.stringify(value.tags),
            value.image_url,
            userDetails.id,
            value.moment_id
          );

        let responseArray = value;
        if (uploadPost.flagCheck == true) {
          res.status(200).send({
            status: 200,
            message: "Updated successfully",
            data: responseArray,
          });
        } else {
          res.status(500).send({
            status: 500,
            message: "something went wrong",
            data: responseArray,
          });
        }
      } else {
        res.status(500).send({
          status: 500,
          message: "User not exists",
          data: [],
        });
      }
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "error",
        data: error.message,
      });
    }
  },

  getAllMoments: async (req, res) => {
    try {
      let userDetails = res.locals.tokenInfo;

      let checkExists = await service.user().getAllMoments();
      if (checkExists.flagCheck == true) {
        let finalJSON = checkExists.data;
        let index = 0;
        finalJSON.forEach((element) => {
          index = index + 1;
          element.tags = element.tags ? JSON.parse(element.tags) : [];
          element["SrNO"] = index;
          return element;
        });

        res.status(200).send({
          status: 200,
          message: "Success",
          data: finalJSON,
        });
      } else {
        res.status(500).send({
          status: 500,
          message: "Moments not exists",
          data: [],
        });
      }
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "error",
        data: error.message,
      });
    }
  },

  deleteMoments: async (req, res) => {
    try {
      const schema = Joi.object({
        moment_id: Joi.number().required(),
      });

      let info = req.query;
      const value = await schema.validateAsync({
        moment_id: info.moment_id,
      });

      // Check email is alread exists in the database or not

      let checkExists = await service.user().checkMomentExists(value.moment_id);

      let userDetails = res.locals.tokenInfo;

      if (checkExists.flagCheck == true) {
        let deleted = await service.user().deleteMoment(value.moment_id);
        let finalJSON = [];
        finalJSON.push(value);
        if (deleted.flagCheck == true) {
          res.status(200).send({
            status: 200,
            message: "success",
            data: finalJSON,
          });
        } else {
          res.status(500).send({
            status: 500,
            message: "Not deleted successfully",
            data: [],
          });
        }
      } else {
        res.status(500).send({
          status: 500,
          message: "Moments not exists",
          data: [],
        });
      }
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: "error",
        data: error.message,
      });
    }
  },
};

module.exports = controller;
