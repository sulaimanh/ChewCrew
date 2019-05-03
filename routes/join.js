var express = require("express");
var router = express.Router();

const crews = require("../controllers/crews");

router.get("/", ensureAuthenticated, crews.join);

router.post("/joinCrew", crews.joinCrew);

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}

module.exports = router;
