const model = require("../model/reviewModel");
const factory = require("./handellingServices");

// Nested route
// Get  /api/products/:productId/reviews
const createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// Nested route (create)
const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

const getReviews = factory.getAll(model);
const creatReview = factory.createOne(model);
const specificReview = factory.specificOne(model);
const updateReview = factory.updateOne(model);

const deleteReview = factory.deleteOne(model);

module.exports = {
  getReviews,
  creatReview,
  specificReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setCategoryIdToBody
};
