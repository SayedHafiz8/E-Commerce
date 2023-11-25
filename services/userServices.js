const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const model = require("../model/userModel");
const ApiErrors = require("../utils/apiErros");
const factory = require("./handellingServices");
const { uploadSingleImage } = require("../middlewares/uploadImage");
const createToken = require("../utils/createToken");

const getusers = factory.getAll(model);
const creatuser = factory.createOne(model);
const specificuser = factory.specificOne(model);
const updateuser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const ducoment = await model.findOneAndUpdate(
    { _id: id },
    {
      name: req.body.name,
      email: req.body.email,
      slug: req.body.slug,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!ducoment) {
    return next(
      new ApiErrors(`Can't find any ducoment with this id ${id}`, 404)
    );
  } else {
    res.status(200).json({ ducoment });
  }
});
const changePassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const ducoment = await model.findOneAndUpdate(
    { _id: id },
    {
      password: await bcrypt.hash(req.body.password, 8),
      passChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!ducoment) {
    return next(
      new ApiErrors(`Can't find any ducoment with this id ${id}`, 404)
    );
  } else {
    res.status(200).json({ ducoment });
  }
});

const deleteuser = factory.deleteOne(model);

const uplodeImage = uploadSingleImage("profileImg");

const resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(`uploads/users/${filename}`);
    req.body.profileImg = filename;
  }
  next();
});

const getLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
const changeLoggedPassword = asyncHandler(async (req, res, next) => {
  const user = await model.findOneAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 8),
      passChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});
const updateLoggedUser = asyncHandler(async (req, res, next) => {
  const updateUser = await model.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );
  console.log(updateUser)

  res.status(200).json({data: updateUser})
});

module.exports = {
  getusers,
  creatuser,
  specificuser,
  updateuser,
  deleteuser,
  changePassword,
  uplodeImage,
  resizeImage,
  getLoggedUser,
  changeLoggedPassword,
  updateLoggedUser
};
