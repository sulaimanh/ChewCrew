
const Crew = require("../models/Crew.js");
const User = require("../models/User.js");
const UserDish = require("../models/UserDish.js");

let active = 0;
exports.crews = (req, res) => {
  active = 0;
  Crew.find({_id : req.user.crewId})
  .then(crews => {
    res.render("crews",{
      active: active,
      crews : crews,
      userId : req.user.id
    });
  }).catch(err => {
    console.log("ERROR");
  });
};

exports.createPage = (req, res) => {
  active = 1;
  res.render("create", {
    active : active
  });
};

exports.createCrew = (req, res) => {
  const creatorName = req.user.firstname + " " + req.user.lastname;
  const crew = new Crew({
    name : req.body.crewName,
    description : req.body.crewDescription,
    creator : req.user._id,
    creatorName : creatorName,
    members : req.user._id
  });

  crew.save()
  .then(createdCrew => {
    User.findOneAndUpdate({_id : req.user._id}, {$push : {crewId : {_id : crew._id}}})
    .then(updatedUser => {
      res.redirect("/crews");
    }).catch(err =>{
      console.log(err);
    });
  });
};



exports.join = (req, res) => {
  active = 2;
  Crew.find({})
  .then(crews => {
    res.render("join", {
      active : active,
      crews : crews,
      userId : req.user.id,
      userCrewsId : req.user.crewId
    });
  }).catch(err => {
    console.log(err);
  });
};

exports.joinCrew = (req, res) => {
  User.updateOne({_id : req.user._id}, {$addToSet : {crewId : req.body.join}})
  .then(updateUser => {
    Crew.updateOne({_id: req.body.join}, {$addToSet : {members : req.user.id}})
    .then(updateCrew => {
      res.redirect("/crews/"+req.body.join);
    }).catch(err =>{
      console.log(err);
    })
  }).catch(err => {
    console.log(err);
  });
};

exports.exactCrew = (req, res) => {
  res.redirect("/crews/"+req.body.crewId);
};

exports.enterCrew = (req, res) => {
  active = 0;
  Crew.findOne({_id : req.params.enterCrew})
  .then(crew => {
    res.render("enterCrew", {
      active: active,
      crew : crew
    });
  });
};

exports.leaveCrew = (req, res) => {
  const crewId = req.body.leave;
  User.updateOne({_id : req.user._id}, {$pull : {crewId : crewId}})
  .then(user => {
    Crew.updateOne({_id : crewId}, {$pull : {members : req.user.id}})
    .then(crew => {
      res.redirect("/crews");
    }).catch(err => {
      console.log(err);
    })
  }).catch(err => {
    console.log(err);
  });
};

exports.deleteCrew = (req, res) => {
  const crewId = req.body.crewId;
  Crew.findOneAndDelete({_id : crewId})
  .then(crew => {
    User.updateOne({_id : req.user._id}, {$pull : {crewId : crewId}})
    .then(user => {
      res.redirect("/crews");
    }).catch(err => {
      console.log(err);
    })
  }).catch(err => {
    console.log(err);
  });
};
