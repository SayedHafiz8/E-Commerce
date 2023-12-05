const asyncHandler = require("express-async-handler");
const ApiErrors = require("../utils/apiErros");
const ApiFeatures = require("../utils/apifeatures");

const deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const ducoment = await model.findByIdAndDelete(id);
    if (!ducoment) {
      return next(
        new ApiErrors(`Can't find any ducoment with thid id ${id}`, 404)
      );
    }
    // Using it for avrRatingsAndQuantity method in reviews model
    ducoment.deleteOne();
    // /////////////////
    res.status(204).send();
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
    }
    // Using it for avrRatingsAndQuantity method in reviews model
    ducoment.save();
    res.status(200).json({ ducoment });
  });

const createOne = (model) =>
  asyncHandler(async (req, res) => {
    const ducoment = await model.create(req.body);
    res.status(201).json({ msg: "Created Successfuly", ducoment });
  });

const specificOne = (model, populationOpts) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) build query
    let query = model.findById(id);
    if (populationOpts) {
      query = query.populate(populationOpts);
    }
    // 2) execute query
    const ducoment = await query;
    // /////////////////
    if (!ducoment) {
      return next(
        new ApiErrors(`Can't find any ducoment with this id ${id}`, 404)
      );
    }
    res.status(200).json({ ducoment });
  });

const getAll = (model) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const documentsCount = await model.countDocuments();
    let apifeatures = new ApiFeatures(model.find(filter), req.query)
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
  getAll,
};
