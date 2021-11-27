const dbConn = require("../../common/database");
const util = require("util");
const query = util.promisify(dbConn.query).bind(dbConn);
const functions = require("../../common/functions");
const { GatewayTimeout } = require("http-errors");

class Users {
  async checkExists(email) {
    return new Promise(async function (resolve, reject) {
      let q = `select * from 5d_users where Email='${email}'`;
      let result = await query(q);
      if (result.length) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  async createUser(info) {
    return new Promise(async function (resolve, reject) {
      let createAt = new Date().toLocaleString();
      let pass = await functions.encryptPassword(info.Password);
      let existsCheck = `insert into 5d_users(full_name,email,password,city) values("${info.Full_Name}",'${info.Email}','${pass}','${info.City}');`;
      // await query(queryToGetVendorId);
      let result = await query(existsCheck);
      if (result.affectedRows == 1) {
        resolve({ flagCheck: true, data: result.recordset });
      } else {
        resolve({ flagCheck: false, data: [] });
      }
    });
  }

  async addMoments(title, tags, images, user_id) {
    return new Promise(async function (resolve, reject) {
      let dateString = new Date().toLocaleString();
      let existsCheck = `insert into 5d_users_moments(title,tags,images,user_id) values('${title}','${tags}','${images}',${user_id})`;
      // await query(queryToGetVendorId);
      let result = await query(existsCheck);
      if (result.affectedRows == 1) {
        resolve({ flagCheck: true, data: result.recordset });
      } else {
        resolve({ flagCheck: false, data: [] });
      }
    });
  }

  /**
 *             value.title,
            JSON.stringify(value.tags),
            value.image_url,
            userDetails.id
 * @returns 
 * 
 * 
 */
  async updateMoments(title, tags, image_url, userid, moment_id) {
    return new Promise(async function (resolve, reject) {
      let updateQeury;
      updateQeury = `Update 5d_users_moments set title =  '${title}',images='${image_url}',tags='${tags}' where user_id = ${userid} and id=${moment_id};`;
      // await query(queryToGetVendorId);
      let result = await query(updateQeury);
      if (result.affectedRows == 1) {
        resolve({ flagCheck: true, data: result.recordset });
      } else {
        resolve({ flagCheck: false, data: [] });
      }
    });
  }

  async login(info) {
    return new Promise(async function (resolve, reject) {
      // let hArray = [];
      // hArray = info.hobbies.length > 0 ? JSON.stringify(info.hobbies) : [];
      let query1 = `select * from 5d_users where  email ='${info.Email}'`;
      // await query(queryToGetVendorId);
      let result = await query(query1);
      if (result.length) {
        const password = functions.decryptPassword(result[0].password);
        if (password !== info.Password) {
          resolve({ flagCheck: false, data: [] });
        } else {
          resolve({ flagCheck: true, data: result[0] });
        }
      } else {
        resolve({ flagCheck: false, data: [] });
      }
    });
  }

  async getAllMoments() {
    return new Promise(async function (resolve, reject) {
      let getQuery;
      getQuery = `select * from 5d_users_moments;`;
      // await query(queryToGetVendorId);
      let result = await query(getQuery);
      if (result.length) {
        resolve({ flagCheck: true, data: result });
      } else {
        resolve({ flagCheck: false, data: [] });
      }
    });
  }

  async checkMomentExists(moment_id) {
    return new Promise(async function (resolve, reject) {
      let getQuery;
      getQuery = `select * from 5d_users_moments where id=${moment_id};`;
      // await query(queryToGetVendorId);
      let result = await query(getQuery);
      if (result.length) {
        resolve({ flagCheck: true, data: result });
      } else {
        resolve({ flagCheck: false, data: [] });
      }
    });
  }

  async deleteMoment(moment_id) {
    return new Promise(async function (resolve, reject) {
      let deleteQeury;
      deleteQeury = `delete from 5d_users_moments where id= ${moment_id}`;
      // await query(queryToGetVendorId);
      let result = await query(deleteQeury);
      if (result.affectedRows == 1) {
        resolve({ flagCheck: true, data: result.recordset });
      } else {
        resolve({ flagCheck: false, data: [] });
      }
    });
  }
}

module.exports = {
  user: function () {
    return new Users();
  },
};
