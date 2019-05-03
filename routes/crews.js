var express = require("express");
var router = express.Router();

const crews = require("../controllers/crews");

router.get("/", ensureAuthenticated, crews.crews);

router.get("/create", ensureAuthenticated, crews.createPage);

router.get("/:enterCrew", ensureAuthenticated, crews.enterCrew);

router.post("/enterCrew", crews.exactCrew);

router.post("/leaveCrew", crews.leaveCrew);

router.post("/deleteCrew", crews.deleteCrew);



function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
    //req.flash('error_msg', ' you are not logged in');
    res.redirect('/');
  }
}
module.exports = router;
