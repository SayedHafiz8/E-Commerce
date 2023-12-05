const { check } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

const addAddressVal = [
  check("alias").notEmpty().withMessage("alias is required"),
  check("details")
    .notEmpty()
    .withMessage("Details is required")
    .isLength({ min: 20 }),
  check("phone")
    .notEmpty()
    .withMessage("Phone is requijred")
    .isMobilePhone("ar-EG"),
  check("city").notEmpty().withMessage("City is required"),
  check("postalCode").optional(),
  validationMiddleware,
];

const removeAddressVal = [
  check("addressId").isMongoId().withMessage("Invalid address Id"),
  validationMiddleware,
];
module.exports = {
  addAddressVal,
  removeAddressVal,
};
