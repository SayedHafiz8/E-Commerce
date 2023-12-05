const { check } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

const addToWishlistVal = [
  check("productId").isMongoId().withMessage("Invalid Product Id"),
  validationMiddleware,
];

const removeProductFromWishlistVal = [
  check("productId").isMongoId().withMessage("Invalid Product Id"),
  validationMiddleware,
];
module.exports = {
  addToWishlistVal,
  removeProductFromWishlistVal,
};
