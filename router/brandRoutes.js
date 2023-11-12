const router = require("express").Router();

const AuthServices = require("../services/authServices");
const {
  creatBrand,
  deleteBrand,
  getBrands,
  specificBrand,
  updateBrand,
  uplodeImage,
  resizeImage,
} = require("../services/brandServices");

const {
  createBrandVal,
  deleteBrandyVal,
  specificBrandVal,
  updateBrandVal,
} = require("../utils/validators/brandValidation");

router
  .route("/")
  .get(getBrands)
  .post(
    AuthServices.protect,
    AuthServices.allowed("admin"),
    uplodeImage,
    resizeImage,
    createBrandVal,
    creatBrand
  );

router
  .route("/:id")
  .get(specificBrandVal, specificBrand)
  .put(
    AuthServices.protect,
    AuthServices.allowed("admin"),
    uplodeImage,
    resizeImage,
    updateBrandVal,
    updateBrand
  )
  .delete(
    AuthServices.protect,
    AuthServices.allowed("admin"),
    deleteBrandyVal,
    deleteBrand
  );

module.exports = router;
