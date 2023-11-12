const model = require("../model/subCategoryModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiErrors = require("../utils/apiErros");
const ApiFeatures = require("../utils/apifeatures");
const factory = require("./handellingServices");

const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
const createSubCateg = factory.createOne(model);
const getAllSubCateg = factory.getAll(model);
const updateSubcateg = factory.updateOne(model);
const specificSubCateg = factory.specificOne(model);
const deleteSubCateg = factory.deleteOne(model);

module.exports = {
  createSubCateg,
  getAllSubCateg,
  updateSubcateg,
  specificSubCateg,
  deleteSubCateg,
  setCategoryIdToBody,
};
