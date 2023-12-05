const router = require("express").Router({ mergeParams: true });

const AuthServices = require("../services/authServices");
const {
  creatReview,
  deleteReview,
  getReviews,
  specificReview,
  updateReview,
  createFilterObj,
  setCategoryIdToBody
} = require("../services/reviewServices");

const {
  createReviewVal,
  deleteReviewyVal,
  specificReviewVal,
  updateReviewVal,
} = require("../utils/validators/reviewValidation");

router
  .route("/")
  .get(createFilterObj,getReviews)
  .post(
    AuthServices.protect,
    AuthServices.allowed("user"),
    setCategoryIdToBody,
    createReviewVal,
    creatReview
  );

router
  .route("/:id")
  .get(specificReview)
  .put(
    AuthServices.protect,
    AuthServices.allowed("admin", "manager", "user"),
    updateReviewVal,
    updateReview
  )
  .delete(
    AuthServices.protect,
    AuthServices.allowed("admin", "manager", "user"),
    deleteReview
  );

module.exports = router;
