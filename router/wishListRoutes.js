const router = require("express").Router();
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishListServices");
const {
  addToWishlistVal,
  removeProductFromWishlistVal,
} = require("../utils/validators/wishListValidation");
const AuthServices = require("../services/authServices");

router
  .route("/")
  .post(
    AuthServices.protect,
    AuthServices.allowed("user"),
    addToWishlistVal,
    addProductToWishlist
  )
  .get(
    AuthServices.protect,
    AuthServices.allowed("user"),
    getLoggedUserWishlist
  );
router.delete(
  "/:productId",
  AuthServices.protect,
  AuthServices.allowed("user"),
  removeProductFromWishlistVal,
  removeProductFromWishlist
);

module.exports = router;
