var express = require("express");
const multer = require("multer");
var router = express.Router();

const crews = require("../controllers/crews");


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

router.get("/", ensureAuthenticated, crews.crews);

router.get("/create", ensureAuthenticated, crews.createPage);

router.get("/:enterCrew", ensureAuthenticated, crews.enterCrew);

router.get("/event/:eventPage", ensureAuthenticated, crews.eventPage);

router.post("/enterCrew", crews.exactCrew);

router.post("/leaveCrew", crews.leaveCrew);

router.post("/deleteCrew", crews.deleteCrew);

router.post("/enterEvent", crews.enterEvent);

router.post("/deleteEvent", crews.deleteEvent);

router.post("/joinEvent", crews.joinEvent);

router.post("/leaveEvent", crews.leaveEvent);

router.post('/deleteEventDish', crews.deleteEventDish);

router.post("/addEventDish", upload.single("image"), crews.addEventDish);

router.post("/createEvent", upload.single("image"), crews.createEvent);

router.post("/createCrew", upload.single("image"), crews.createCrew);

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/');
  }
}
module.exports = router;
