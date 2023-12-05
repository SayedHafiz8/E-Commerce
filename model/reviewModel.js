const mongoose = require("mongoose");

const model = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rataings: {
      type: Number,
      min: [1, "min rating value is 1.0"],
      max: [5, "max rating value is 5.0"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.statics.avrRatingsAndQuantity = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$rataings" },
        avgQantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await model.findByIdAndUpdate(productId, {
      ratingAvarge: result[0].avgRatings,
      ratingQantity: result[0].avgQantity,
    });
  } else {
    await model.findByIdAndUpdate(productId, {
      ratingAvarge: 0,
      ratingQantity: 0,
    });
  }
};
reviewSchema.post("save", async function () {
  await this.constructor.avrRatingsAndQuantity(this.product);
});

reviewSchema.post("deleteOne", async function () {
  await this.constructor.avrRatingsAndQuantity(this.product);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

const reviewModel = mongoose.model("Review", reviewSchema);
module.exports = reviewModel;
