const { check, body } = require("express-validator");

exports.signupCheck = [
  body("email", "Something went wrong, please try with another Email.")
    .isEmail()
    .withMessage("Invalid Email")
    .custom((value, { req }) => {
      if (value === "test@test.com") {
        throw new Error("This email address is forbidden");
      }
      return true;
    }),
  body(
    "password",
    "Please enter a password with only numbers and text and at least 5 characters"
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
    .custom((value, { req }) => {
      if (value === "test@test.com") {
        throw new Error("This email address is forbidden");
      }
      return true;
    }),
  body(
    "password",
    "Please enter a password with only numbers and text and at least 5 characters"
  ).isLength({ min: 5 }),
];
