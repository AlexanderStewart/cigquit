const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    quitDate: {
      type: Date,
    },
    cigCount: {
      type: Number,
    },
    cigPerPack: {
      type: Number,
    },
    moneyPerPack: {
      type: Number,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
