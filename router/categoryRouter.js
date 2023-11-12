//export validation arraies
const router = require("express").Router();

const AuthServices = require("../services/authServices");
const {
  specificCategoryVal,
  updateCategoryVal,
  createCategoryVal,
  deleteCategoryVal,
} = require("../utils/validators/categoryValidation");
// export services methods
const {
  creatCategory,
  getCategory,
  specificCategory,
  updateCategory,
  deleteCategory,
  uplodeImage,
  resizeImage,
} = require("../services/categoryServices");
const subcategoryRoutes = require("./subCategoiesRoutes");

router.use("/:categoryId", subcategoryRoutes);

router.post(
  "/creatCategory",
  AuthServices.protect,
  AuthServices.allowed("admin", "manager"),
  uplodeImage,
  resizeImage,
  createCategoryVal,
  creatCategory
);
router.get("/allCategories", getCategory);
router.get("/getOneCategory/:id", specificCategoryVal, specificCategory);
router.put(
  "/updateOneCtegory/:id",
  AuthServices.protect,
  AuthServices.allowed("admin", "manager"),
  uplodeImage,
  resizeImage,
  updateCategoryVal,
  updateCategory
);
router.delete(
  "/deleteCategory/:id",
  AuthServices.protect,
  AuthServices.allowed("admin", "manager"),
  deleteCategoryVal,
  deleteCategory
);

module.exports = router;
