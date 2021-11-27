var express = require("express");
var router = express.Router();
const controller = require("./controller");
const auth = require("../../common/authentication");
const multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  },
});
var upload = multer({ storage: storage });

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/createUser", controller.createUser);
router.post("/login", controller.login);

router.post("/addMoments", auth.validateToken, controller.addMoments);

router.patch("/updateMoments", auth.validateToken, controller.updateMoments);

router.get("/getAllMoments", auth.validateToken, controller.getAllMoments);

router.delete("/deleteMoment", controller.deleteMoments);

module.exports = router;
