var express = require("express");
var router = express.Router();

const profile = require("../controllers/profile");

router.get("/", profile.profile);




module.exports = router;
