var config = require("../config");
var mysql = require("mysql");

var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  database: config.database,
  password: config.password,
});

con.connect((err, data) => {
  if (err) {
    console.log("Error : ", err);
  } else {
    console.log("Connection Established!!");
  }
});

module.exports = con;
