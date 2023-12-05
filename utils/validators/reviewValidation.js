const { check } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const slugify = require("slugify");
const model = require("../../model/reviewModel");

const specificReviewVal = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validationMiddleware,
];
const createReviewVal = [
  check("title").optional(),
  check("rataings")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 }),
  check("user").isMongoId().withMessage("Invalid uesr id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom((val, { req }) =>
      model
        .findOne({ user: req.user._id, product: req.body.product })
        .then((review) => {
          if (review) {
            return Promise.reject(
              new Error("You already created a review before")
            );
          }
        })
    ),
  validationMiddleware,
];
const updateReviewVal = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) =>
      model.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("No review for this user"));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to perform this action")
          );
        }
      })
    ),
  validationMiddleware,
];
const deleteReviewyVal = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) => {
      if (req.user.role == "user") {
        return model.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(new Error("No review for this user"));
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to perform this action")
            );
          }
        });
      }
      return true
    }),
  validationMiddleware,
];
module.exports = {
  specificReviewVal,
  updateReviewVal,
  createReviewVal,
  deleteReviewyVal,
};
