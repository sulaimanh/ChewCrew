var express = require("express");
const multer = require("multer");
var router = express.Router();

const crews = require("../controllers/crews");

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

router.get("/", ensureAuthenticated, crews.createPage);

router.get("/:editCrewPage", ensureAuthenticated, crews.editCrewPage);

router.post("/submitEditCrew", upload.single("image"), crews.submitEditCrew);

router.post("/editCrew", crews.editCrew);



function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}

module.exports = router;
