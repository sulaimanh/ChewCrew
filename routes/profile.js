var express = require("express");
var router = express.Router();

const profile = require("../controllers/profile");

router.get("/", ensureAuthenticated, profile.profile);

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}


module.exports = router;
