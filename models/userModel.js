const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    require: [true, "fname is required!"],
    trim: true,
  },
  lname: {
    type: String,
    require: [true, "lname is required!"],
    trim: true,
  },
  email: {
    type: String,
    require: [true, "email is required!"],
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw Error("not valid email!");
      }
    },
  },
  mobile: {
    type: String,
    require: [true, "mobile is required!"],
    trim: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
  },
  gender: {
    type: String,
    require: [true, "gender is required!"],
    trim: true,
  },
  status: {
    type: String,
    require: [true, "status is required!"],
    trim: true,
  },
  profile: {
    type: String,
    require: [true, "profile is required!"],
    trim: true,
  },
  location: {
    type: String,
    require: [true, "location is required!"],
    trim: true,
  },
  datecreated: Date,
  dateUpdated: Date,
});

module.exports = mongoose.model("User", userSchema);
