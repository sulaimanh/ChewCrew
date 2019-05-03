var express = require("express");
var router = express.Router();

const crews = require("../controllers/crews");

router.get("/", ensureAuthenticated, crews.createPage);

router.post("/createCrew", crews.createCrew);

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}

module.exports = router;
