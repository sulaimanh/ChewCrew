var express = require("express");
var router = express.Router();

const crews = require("../controllers/crews");

router.get("/", ensureAuthenticated, crews.join);

router.post("/joinCrew", crews.joinCrew);

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
    //req.flash('error_msg', ' you are not logged in');
    res.redirect('/');
  }
}

module.exports = router;
