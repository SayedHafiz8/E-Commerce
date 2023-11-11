const { check } = require("express-validator");
const bcrypt = require("bcrypt");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const slugify = require("slugify");
const model = require("../../model/userModel");

const specificUesrVal = [
  check("id").isMongoId().withMessage("Invalid Uesr id format"),
  validationMiddleware,
];
const createUesrVal = [
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
    .withMessage("enail is required")
    .isEmail()
    .withMessage("Invalid email")
    .custom((val) =>
      model.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("This email in use"));
        }
      })
    ),
  check("phone").optional().isMobilePhone("ar-EG"),
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
const updateUesrVal = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .isLength({ max: 32 })
    .withMessage("Too long message name")
    .isLength({ min: 3 })
    .withMessage("Too short message name"),
  validationMiddleware,
];
const deleteUesrVal = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validationMiddleware,
];
const changePasswordVal = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("current password is required"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirm is required"),
  check("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      // 1) current password
      const user = await model.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      // 2) confirm password
      if (val != req.body.passwordConfirm) {
        throw new Error("password confirm incorrect");
      }
      return true;
    }),
  validationMiddleware,
];
module.exports = {
  specificUesrVal,
  updateUesrVal,
  createUesrVal,
  deleteUesrVal,
  changePasswordVal,
};
