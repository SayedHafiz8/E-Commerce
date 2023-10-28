const router = require("express").Router();
const {
  createProductVal,
  deleteProductVal,
  spcificProductVal,
  updateProductVal,
} = require("../utils/validators/productValidation");
const {
  createProduct,
  deleteProduct,
  getAllProducts,
  specificProduct,
  updateProduct,
  uploadImage,
  resizeImage,
} = require("../services/productSevices");

router
  .route("/")
  .get(getAllProducts)
  .post(uploadImage, resizeImage, createProductVal, createProduct);

router
  .route("/:id")
  .get(spcificProductVal, specificProduct)
  .put(updateProductVal, updateProduct)
  .delete(deleteProductVal, deleteProduct);
module.exports = router;
