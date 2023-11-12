const model = require("../model/categoryModel");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const factory = require("./handellingServices");
const { uploadSingleImage } = require("../middlewares/uploadImage");

// Disk storage engine
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const fieldname = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, fieldname);
//   },
// });

const uplodeImage = uploadSingleImage("image");

const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
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

const getCategory = factory.getAll(model);

const creatCategory = factory.createOne(model);

const specificCategory = factory.specificOne(model);

const updateCategory = factory.updateOne(model);

const deleteCategory = factory.deleteOne(model);

module.exports = {
  creatCategory,
  getCategory,
  specificCategory,
  updateCategory,
  deleteCategory,
  uplodeImage,
  resizeImage,
};
