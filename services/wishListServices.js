const asyncHandler = require("express-async-handler");

const model = require("../model/userModel");

const addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await model.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishList: req.body.productId },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "Success",
    msg: "Product added successfuly to your wishList",
    data: user.wishList,
  });
});
const removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await model.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishList: req.params.productId },
    },
    {
      new: true,
    }
  );

  res.status(204).send();
});
const getLoggedUserWishlist = asyncHandler(async (req, res) => {
  const user = await model.findById(req.user._id).populate("wishList");
  res.status(200).json({
    status: "success",
    result: user.wishList.length,
    data: user.wishList,
  });
});

module.exports = {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist
};
