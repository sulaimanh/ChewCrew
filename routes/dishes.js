var express = require("express");
var router = express.Router();

const dishes = require("../controllers/dishes");

router.get("/", ensureAuthenticated, dishes.dishes);

router.get("/:editDish", ensureAuthenticated, dishes.editDishPage);

router.post("/editDish", dishes.editDish);

router.post("/deleteDish", dishes.deleteDish);

router.post("/updateDish", dishes.updateDish);

router.post("/addDish", dishes.addDish);


function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}


module.exports = router;
