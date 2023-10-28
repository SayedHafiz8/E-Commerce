const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const model = require("../model/productModel");
const asyncHandler = require("express-async-handler");
const factory = require("./handellingServices");
const { uploadFieldsImages } = require("../middlewares/uploadImage");

const uploadImage = uploadFieldsImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

const resizeImage = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const filename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${filename}`);
    req.body.imageCover = filename;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const filesname = `product-${uuidv4()}-${Date.now()}-${index}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${filesname}`);
        req.body.images.push(filesname);
      })
    );
    console.log(req.body.imageCover);
    console.log(req.body.images);
  }
  next();
});

const createProduct = factory.createOne(model);
const getAllProducts = factory.getAll(model);
const specificProduct = factory.specificOne(model);
const updateProduct = factory.updateOne(model);
const deleteProduct = factory.deleteOne(model);

module.exports = {
  createProduct,
  getAllProducts,
  specificProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  resizeImage,
};
