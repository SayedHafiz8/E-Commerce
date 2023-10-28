const express = require("express")
const { createSubCategVal, deleteSubCategVal, specificSubCategVal, updateSubcategVal} = require("../utils/validators/subCategoryValidation")
const { createSubCateg, getAllSubCateg, deleteSubCateg, specificSubCateg, updateSubcateg, setCategoryIdToBody} = require("../services/subCategoriesServices");

const router = express.Router({ mergeParams: true })

router.post("/createSubCateg", setCategoryIdToBody,createSubCategVal,createSubCateg);
router.get("/getAllSubCateg", getAllSubCateg);
router.get("/specificSubCateg/:id", specificSubCategVal,specificSubCateg);
router.put("/updateSubcateg/:id", updateSubcategVal,updateSubcateg);
router.delete("/deleteSubCateg/:id", deleteSubCategVal,deleteSubCateg)

module.exports = router;
