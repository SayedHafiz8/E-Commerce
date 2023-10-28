//export validation arraies
const router = require("express").Router();
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
  uplodeImage,
  resizeImage,
  createCategoryVal,
  creatCategory
);
router.get("/allCategories", getCategory);
router.get("/getOneCategory/:id", specificCategoryVal, specificCategory);
router.put(
  "/updateOneCtegory/:id",
  uplodeImage,
  resizeImage,
  updateCategoryVal,
  updateCategory
);
router.delete("/deleteCategory/:id", deleteCategoryVal, deleteCategory);

module.exports = router;
