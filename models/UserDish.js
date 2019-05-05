const mongoose = require("mongoose");

const userDishSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  tags: [String],
  imagePath: {
    type: String,
    required: false
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

userDishSchema.index({
  name: "text"
});

module.exports = mongoose.model("UserDish", userDishSchema);
