const multer = require("multer");
var express = require("express");
var router = express.Router();

const dishes = require("../controllers/dishes");

const storage = multer.diskStorage({
  destination : function(req, file, cb){
    cb(null, "public/uploads");
  },
  filename : function(req, file, cb){
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const upload = multer({
  storage : storage
});

router.get("/", ensureAuthenticated, dishes.dishes);

router.get("/:editDish", ensureAuthenticated, dishes.editDishPage);

router.post("/editDish", dishes.editDish);

router.post("/deleteDish", dishes.deleteDish);

router.post("/updateDish", dishes.updateDish);

router.post("/addDish", upload.single("image"), dishes.addDish);


function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}


module.exports = router;
