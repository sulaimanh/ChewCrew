const Crew = require("../models/Crew.js");
const User = require("../models/User.js");
const UserDish = require("../models/UserDish.js");
const Event = require("../models/Event.js");

let active = 0;
exports.crews = (req, res) => {
  active = 0;
  if (req.query.crewName) {
    const crewName = req.query.crewName;
    Crew.find({
        _id: req.user.crewId,
        $text: {
          $search: crewName
        }
      }, {
        score: {
          $meta: "textScore"
        }
      }).sort({
        score: {
          $meta: "textScore"
        }
      })
      .then(crews => {
        res.render("crews", {
          active: active,
          crews: crews,
          userId: req.user.id,
          userCrewsId: req.user.crewId
        });
      }).catch(err => {
        console.log(err);
      });
  } else {
    Crew.find({
        _id: req.user.crewId
      })
      .then(crews => {
        res.render("crews", {
          active: active,
          crews: crews,
          userId: req.user.id
        });
      }).catch(err => {
        console.log("ERROR");
      });
  }
};

exports.createPage = (req, res) => {
  active = 1;
  res.render("create", {
    active: active
  });
};

exports.createCrew = (req, res) => {
  let imagePath;
  if (req.file) {
    imagePath = req.file.path;
  }
  const creatorName = req.user.firstname + " " + req.user.lastname;
  const crew = new Crew({
    name: req.body.crewName,
    description: req.body.crewDescription,
    creator: req.user._id,
    creatorName: creatorName,
    members: req.user._id,
    image: imagePath
  });

  crew.save()
    .then(createdCrew => {
      User.findOneAndUpdate({
          _id: req.user._id
        }, {
          $push: {
            crewId: {
              _id: crew._id
            }
          }
        })
        .then(updatedUser => {
          res.redirect("/crews");
        }).catch(err => {
          console.log(err);
        });
    });
};



exports.join = (req, res) => {
  active = 2;

  if (req.query.crewName) {
    const crewName = req.query.crewName;
    Crew.find({
        $text: {
          $search: crewName
        }
      }, {
        score: {
          $meta: "textScore"
        }
      }).sort({
        score: {
          $meta: "textScore"
        }
      })
      .then(crews => {
        res.render("join", {
          active: active,
          crews: crews,
          userId: req.user.id,
          userCrewsId: req.user.crewId
        });
      }).catch(err => {
        console.log(err);
      });
  } else {
    Crew.find({})
      .then(crews => {
        res.render("join", {
          active: active,
          crews: crews,
          userId: req.user.id,
          userCrewsId: req.user.crewId
        });
      }).catch(err => {
        console.log(err);
      });
  }
};

exports.joinCrew = (req, res) => {
  User.updateOne({
      _id: req.user._id
    }, {
      $addToSet: {
        crewId: req.body.join
      }
    })
    .then(updateUser => {
      Crew.updateOne({
          _id: req.body.join
        }, {
          $addToSet: {
            members: req.user.id
          }
        })
        .then(updateCrew => {
          res.redirect("/crews/" + req.body.join);
        }).catch(err => {
          console.log(err);
        })
    }).catch(err => {
      console.log(err);
    });
};

exports.exactCrew = (req, res) => {
  res.redirect("/crews/" + req.body.crewId);
};

exports.enterCrew = (req, res) => {
  active = 0;
  Crew.findOne({
      _id: req.params.enterCrew
    })
    .then(crew => {
      Event.find({
          _id: crew.events
        })
        .then(events => {
          res.render("enterCrew", {
            active: active,
            crew: crew,
            userId: req.user.id,
            userCrewsId: req.user.crewId,
            events: events
          });
        }).catch(err => {
          console.log(err);
        })
    });
};

exports.leaveCrew = (req, res) => {
  const crewId = req.body.leave;
  User.updateOne({
      _id: req.user._id
    }, {
      $pull: {
        crewId: crewId
      }
    })
    .then(user => {
      Crew.updateOne({
          _id: crewId
        }, {
          $pull: {
            members: req.user.id
          }
        })
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
  Crew.findOneAndDelete({
      _id: crewId
    })
    .then(crew => {
      User.updateOne({
          _id: req.user._id
        }, {
          $pull: {
            crewId: crewId
          }
        })
        .then(user => {
          res.redirect("/crews");
        }).catch(err => {
          console.log(err);
        })
    }).catch(err => {
      console.log(err);
    });
};

exports.editCrew = (req, res) => {
  res.redirect("/create/" + req.body.edit);
}

exports.editCrewPage = (req, res) => {
  let active = 0;
  const crewId = req.params.editCrewPage;
  Crew.findOne({
      _id: crewId
    })
    .then(crew => {
      res.render("editCrew", {
        active: active,
        crew: crew
      });
    }).catch(err => {
      console.log(err);
    });
}

exports.submitEditCrew = (req, res) => {
  const crewId = req.body.update;
  Crew.findOne({
      _id: crewId
    })
    .then(crew => {
      let imagePath = crew.image;
      if (req.file) {
        imagePath = req.file.path;
      }

      Crew.findOneAndUpdate({
          _id: crewId
        }, {
          "$set": {
            name: req.body.crewName,
            description: req.body.description,
            image: imagePath
          }
        })
        .then(dish => {
          res.redirect("/crews/" + crewId);
        }).catch(err => {
          console.log(err);
        });
    }).catch(err => {
      console.log(err);
    });
}

exports.createEvent = (req, res) => {
  let imagePath;
  if (req.file) {
    imagePath = req.file.path;
  }

  const newEvent = new Event({
    name: req.body.name,
    description: req.body.description,
    time: req.body.time,
    date: req.body.date,
    location: req.body.location,
    image: imagePath
  });

  newEvent.save()
    .then(createEvent => {
      Crew.findOneAndUpdate({
          _id: req.body.create
        }, {
          $push: {
            events: {
              _id: newEvent._id
            }
          }
        })
        .then(updatedCrewEvent => {
          res.redirect("/crews/" + req.body.create);
        }).catch(err => {
          console.log(err);
        })
    }).catch(err => {
      console.log(err);
    });
}


exports.deleteEvent = (req, res) => {
  const eventId = req.body.eventId;
  Event.findOneAndDelete({
      _id: eventId
    })
    .then(ev => {
      Crew.updateOne({
          _id: req.body.crewId
        }, {
          $pull: {
            events: eventId
          }
        })
        .then(user => {
          res.redirect("/crews/" + req.body.crewId);
        }).catch(err => {
          console.log(err);
        })
    }).catch(err => {
      console.log(err);
    });
}



exports.joinEvent = (req, res) => {
    Event.updateOne({_id : req.body.join}, {
      $addToSet : {
        members : req.user.id
      }
    })
    .then(eventUpdate => {
      res.redirect("/crews/" + req.body.crewId)
    }).catch(err => {
      console.log(err);
    });
}

exports.leaveEvent = (req, res) => {
  const eventId = req.body.leave;
  Event.updateOne({
    _id: eventId
  }, {
    $pull: {
      members: req.user._id
    }
  })
  .then(updated => {
    res.redirect("/crews/" + req.body.crewId);
  }).catch(err => {
    console.log(err);
  });
}
