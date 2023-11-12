const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const model = require("../model/brandModel");
const factory = require("./handellingServices");
const { uploadSingleImage } = require("../middlewares/uploadImage");

const getBrands = factory.getAll(model);
const creatBrand = factory.createOne(model);
const specificBrand = factory.specificOne(model);
const updateBrand = factory.updateOne(model);

const deleteBrand = factory.deleteOne(model);

const uplodeImage = uploadSingleImage("image");

const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `Brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(`uploads/categories/${filename}`);

    req.body.image = filename;
  }
  next();
});

module.exports = {
  getBrands,
  creatBrand,
  specificBrand,
  updateBrand,
  deleteBrand,
  uplodeImage,
  resizeImage,
};
