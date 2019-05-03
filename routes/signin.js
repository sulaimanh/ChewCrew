var express = require("express");
var router = express.Router();

const signin = require("../controllers/signin");

router.get("/", signin.signIn);

// router.post("/login", signin.login);

// router.post("/logout", signin.logout);


module.exports = router;
