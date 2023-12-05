const asyncHandler = require("express-async-handler");

const model = require("../model/userModel");

const addAddress= asyncHandler(async (req, res, next) => {
  const user = await model.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { adresses: req.body },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "Success",
    msg: "Address added successfuly",
    data: user.adresses,
  });
});
const removeAddress = asyncHandler(async (req, res, next) => {
  const user = await model.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { adresses: {_id: req.params.addressId} },
    },
    {
      new: true,
    }
  );

  res.status(204).send();
});
const getLoggedUserAddress = asyncHandler(async (req, res) => {
  const user = await model.findById(req.user._id).populate("wishList");
  res.status(200).json({
    status: "success",
    result: user.adresses.length,
    data: user.adresses,
  });
});

module.exports = {
  addAddress,
  removeAddress,
  getLoggedUserAddress
};
