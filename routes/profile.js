var express = require("express");
const multer = require("multer");
var router = express.Router();

const profile = require("../controllers/profile");

const storage = multer.diskStorage({
  destination : function(req, file, cb){
    cb(null, "public/uploads");
  },
  filename : function(req, file, cb){
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({
  storage : storage
});

router.get("/", ensureAuthenticated, profile.profile);

router.post("/addPicture", upload.single("image"), profile.addPicture);

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}


module.exports = router;
