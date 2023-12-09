const router = require("express").Router();

const AuthServices = require("../services/authServices");
const {
  addProductToCart,
  getLoggedUserCart,
  removeOneCartItem,
  clearCart,
  updateCartItemQuant,
  applyCopoun,
} = require("../services/cartServices");

// const {
//   createCopounVal,
//   deleteCopounyVal,
//   specificCopounVal,
//   updateCopounVal,
// } = require("../utils/validators/brandValidation");

router
  .route("/")
  .post(AuthServices.protect, AuthServices.allowed("user"), addProductToCart)
  .get(AuthServices.protect, AuthServices.allowed("user"), getLoggedUserCart)
  .delete(AuthServices.protect, AuthServices.allowed("user"), clearCart);

router.put(
  "/applyCopoun",
  AuthServices.protect,
  AuthServices.allowed("user"),
  applyCopoun
);
router
  .route("/:itemId")
  .put(AuthServices.protect, AuthServices.allowed("user"), updateCartItemQuant)
  .delete(
    AuthServices.protect,
    AuthServices.allowed("user"),
    removeOneCartItem
  );

module.exports = router;
