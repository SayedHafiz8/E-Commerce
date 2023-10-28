const asyncHandler = require("express-async-handler");
const ApiErrors = require("../utils/apiErros");
const ApiFeatures = require("../utils/apifeatures");

const deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const ducoment = await model.findByIdAndDelete({ _id: id });
    if (!ducoment) {
      return next(
        new ApiErrors(`Can't find any ducoment with thid id ${id}`, 404)
      );
    } else {
      res.status(204).send();
    }
  });

const updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const ducoment = await model.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!ducoment) {
      return next(
        new ApiErrors(`Can't find any ducoment with this id ${id}`, 404)
      );
    } else {
      res.status(200).json({ ducoment });
    }
  });

const createOne = (model) =>
  asyncHandler(async (req, res) => {
    const ducoment = await model.create(req.body);
    res.status(201).json({ msg: "Created Successfuly", ducoment });
  });

const specificOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const ducoment = await model.findById(id);
    if (!ducoment) {
      return next(
        new ApiErrors(`Can't find any ducoment with this id ${id}`, 404)
      );
    }
    res.status(200).json({ ducoment });
  });

const getAll = (model) =>
  asyncHandler(async (req, res, next) => {
    let filterObj = {}
    if (req.params.categoryId) filterObj = {category: req.params.categoryId}
    const documentsCount = await model.countDocuments();
    let apifeatures = new ApiFeatures(model.find(filterObj), req.query)
      .filter()
      .search()
      .limiting()
      .pagination(documentsCount)
      .sort();

    const { mongooseQuery, paginationResult } = apifeatures;
    const ducoment = await mongooseQuery;
    if (!ducoment) {
      next(new ApiErrors("No ducoment yet", 404));
    }
    res
      .status(200)
      .json({ results: ducoment.length, paginationResult, ducoment });
  });
module.exports = {
  deleteOne,
  updateOne,
  createOne,
  specificOne,
  getAll
};
