const { check } = require("express-validator");
const bcrypt = require("bcrypt");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const slugify = require("slugify");
const model = require("../../model/userModel");

const signupVal = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 32 })
    .withMessage("Too long message name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .isLength({ min: 3 })
    .withMessage("Too short message name"),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email")
    .custom((val) =>
      model.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("This email in use"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isStrongPassword()
    .withMessage("Must be a strong password")
    .custom((password, { req }) => {
      if (password != req.body.passwordConfirm) {
        throw new Error("password confirm incorrect");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirm is required"),
  validationMiddleware,
];
const loginVal = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .withMessage("Must be a strong password"),

  validationMiddleware,
];

module.exports = {
  signupVal,
  loginVal
};
