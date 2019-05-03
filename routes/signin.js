var express = require("express");
var router = express.Router();

const signin = require("../controllers/signin");

router.get("/", signin.signIn);




module.exports = router;
