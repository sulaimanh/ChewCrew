var express = require("express");
var router = express.Router();

const profile = require("../controllers/profile");

router.get("/", profile.profile);

// router.post("/login", signin.login);

// router.post("/logout", signin.logout);


module.exports = router;
