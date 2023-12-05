const router = require("express").Router();
const {
  addAddress,
  getLoggedUserAddress,
  removeAddress
} = require("../services/addressServices");
const {
  addAddressVal,
  removeAddressVal
} = require("../utils/validators/addressValidation");
const AuthServices = require("../services/authServices");

router
  .route("/")
  .post(
    AuthServices.protect,
    AuthServices.allowed("user"),
    addAddressVal,
    addAddress
  )
  .get(
    AuthServices.protect,
    AuthServices.allowed("user"),
    getLoggedUserAddress
  );
router.delete(
  "/:addressId",
  AuthServices.protect,
  AuthServices.allowed("user"),
  removeAddressVal,
  removeAddress
);

module.exports = router;
