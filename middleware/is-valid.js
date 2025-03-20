const { check, body } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs")

exports.signupCheck = [
  body("email", "Something went wrong, please try with another Email.")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (value, { req }) => {
      const user = await User.findOne({email:value});
      if(user){
        throw new Error("E-mail already exists.")
      }
      return true
    }),
  body(
    "password",
    "Please enter a password with at least 5 characters."
  ).isLength({ min: 5 }),
  body("confirmpassword", "Passwords do not match, please try again.").custom(
    (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match, please try again.");
      }
      return true;
    }
  ),
];

exports.loginCheck = [
  body("email", "Something went wrong, please try with another Email.")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (!user) {
        throw new Error("Email not found.");
      }
      return true;
    }),
  body("password").custom(async (value, { req }) => {
    const user = await User.findOne({ email: req.body.email });
    if(user){
      const passCheck = await bcrypt.compare(value, user.password);
      if (!passCheck) {
        throw new Error("Invalid Password.");
      }
    } else{
      return true
    }
    return true
  }),
];
