const router = require("express").Router();

const AuthServices = require("../services/authServices");
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
  .post(
    AuthServices.protect,
    AuthServices.allowed("admin", "user"),
    uploadImage,
    resizeImage,
    createProductVal,
    createProduct
  );

router
  .route("/:id")
  .get(spcificProductVal, specificProduct)
  .put(
    AuthServices.protect,
    AuthServices.allowed("admin", "user"),
    updateProductVal,
    updateProduct
  )
  .delete(
    AuthServices.protect,
    AuthServices.allowed("admin"),
    deleteProductVal,
    deleteProduct
  );
module.exports = router;
