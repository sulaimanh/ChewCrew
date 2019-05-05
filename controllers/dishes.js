const User = require("../models/User.js");
const UserDish = require("../models/UserDish.js");
const Crew = require("../models/Crew.js");

exports.dishes = (req, res) => {
  let active = 3;
  if (req.query.dishName) {
    const dishName = req.query.dishName;
    UserDish.find({
        $text: {
          $search: dishName
        }
      },{score : {$meta : "textScore"}}).sort( { score: { $meta: "textScore" } } )
      .then(dishes => {
        res.render("dishes", {
          active: active,
          dishes: dishes
        });
      }).catch(err => {
        console.log(err);
      });
  } else {
    UserDish.find({
        _id: req.user.dishId
      })
      .then(dishes => {
        res.render("dishes", {
          active: active,
          dishes: dishes
        });
      }).catch(err => {
        console.log(err);
      });
  }
}

exports.editDishPage = (req, res) => {
  let active = 3;
  UserDish.findOne({
      _id: req.params.editDish
    })
    .then(dish => {
      res.render("editDish", {
        active: active,
        dish: dish
      });
    }).catch(err => {
      console.log(err);
    });
}

exports.editDish = (req, res) => {
  res.redirect("/dishes/" + req.body.edit);
}

exports.updateDish = (req, res) => {
  const dishId = req.body.update;
  UserDish.findOneAndUpdate({
      _id: dishId
    }, {
      "$set": {
        name: req.body.dish,
        description: req.body.description,
        tags: req.body.tags
      }
    })
    .then(dish => {
      res.redirect("/dishes");
    }).catch(err => {
      console.log(err);
    });
}

exports.deleteDish = (req, res) => {
  const dishId = req.body.dishTitle;
  UserDish.findOneAndDelete({
      _id: dishId
    })
    .then(dish => {
      User.updateOne({
          _id: req.user._id
        }, {
          $pull: {
            dishId: dishId
          }
        })
        .then(user => {
          res.redirect("/dishes");
        }).catch(err => {
          console.log(err);
        })
    }).catch(err => {
      console.log(err);
    });
}


exports.addDish = (req, res) => {
  const dish = new UserDish({
    name: req.body.dish,
    description: req.body.description,
    tags: req.body.tags,
    creator: req.user._id
  });

  dish.save()
    .then(createdDish => {
      User.findOneAndUpdate({
          _id: req.user._id
        }, {
          $push: {
            dishId: {
              _id: dish._id
            }
          }
        })
        .then(user => {
          res.redirect("/dishes");
        }).catch(err => {
          console.log(err);
        })
    }).catch(err => {
      console.log(err);
    });
}
