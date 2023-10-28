const router = require("express").Router();
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
  .post(uplodeImage, resizeImage, createBrandVal, creatBrand);

router
  .route("/:id")
  .get(specificBrandVal, specificBrand)
  .put(uplodeImage, resizeImage, updateBrandVal, updateBrand)
  .delete(deleteBrandyVal, deleteBrand);

module.exports = router;
