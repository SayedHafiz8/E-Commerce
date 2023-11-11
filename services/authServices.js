const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const asyncHandler = require("express-async-handler");
const model = require("../model/userModel");
const ApiErrors = require("../utils/apiErros");

const signUp = asyncHandler(async (req, res, next) => {
  // 1- create user
  const user = await model.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2- Generate token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRE_TIME,
  });

  res.status(201).json({ data: user, token });
});

const login = asyncHandler(async(req, res, next) => {
  const user = await model.findOne({ email: req.body.email })

  if(!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiErrors('Incorrect email or password'));
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRE_TIME,
  });

  res.status(200).json({ data: user, token})
})

module.exports = { signUp, login };
