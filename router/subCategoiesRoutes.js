const express = require("express");
const {
  createSubCategVal,
  deleteSubCategVal,
  specificSubCategVal,
  updateSubcategVal,
} = require("../utils/validators/subCategoryValidation");
const {
  createSubCateg,
  getAllSubCateg,
  deleteSubCateg,
  specificSubCateg,
  updateSubcateg,
  setCategoryIdToBody,
} = require("../services/subCategoriesServices");
const AuthServices = require("../services/authServices");

const router = express.Router({ mergeParams: true });

router.post(
  "/createSubCateg",
  AuthServices.protect,
  AuthServices.allowed("admin", "manager"),
  setCategoryIdToBody,
  createSubCategVal,
  createSubCateg
);
router.get("/getAllSubCateg", getAllSubCateg);
router.get("/specificSubCateg/:id", specificSubCategVal, specificSubCateg);
router.put(
  "/updateSubcateg/:id",
  AuthServices.protect,
  AuthServices.allowed("admin", "manager"),
  updateSubcategVal,
  updateSubcateg
);
router.delete(
  "/deleteSubCateg/:id",
  AuthServices.protect,
  AuthServices.allowed("admin"),
  deleteSubCategVal,
  deleteSubCateg
);

module.exports = router;
