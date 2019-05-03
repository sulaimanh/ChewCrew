var express = require("express");
var router = express.Router();

const crews = require("../controllers/crews");

router.get("/", ensureAuthenticated, crews.createPage);

router.post("/createCrew", crews.createCrew);

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
    //req.flash('error_msg', ' you are not logged in');
    res.redirect('/');
  }
}
//
// router.post("/leaveCrew", crews.leaveCrew);
//
// router.post("/deleteCrew", crews.deleteCrew);
//
// router.post("/enterCrew", crews.enterCrew);
//
// router.post("/joinCrew", crews.joinCrew);


module.exports = router;
