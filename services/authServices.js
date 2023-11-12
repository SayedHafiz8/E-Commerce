const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

const login = asyncHandler(async (req, res, next) => {
  const user = await model.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiErrors("Incorrect email or password"));
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRE_TIME,
  });

  res.status(200).json({ data: user, token });
});

const protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiErrors(
        "You are not login, please login to get access for this route",
        401
      )
    );
  }

  // 2) verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user exists
  const user = await model.findById(decoded.userId);
  if (!user) {
    return next(new ApiErrors("This user does not longer exist", 401));
  }

  // 4) Check if user change his password after token genarated
  if (user.passChangedAt) {
    // change the date of change password from date to time
    const passChangeTime = parseInt(user.passChangedAt.getTime() / 1000, 10);

    if (passChangeTime > decoded.iat) {
      //  (decoded.iat) ==> the time of token generated
      return next(
        new ApiErrors(
          "This user recently changed his password, please login again...",
          401
        )
      );
    }
  }

  req.user = user;

  next();
});

const allowed = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiErrors("You are not allowed for this route", 403));
    }
    next();
  });

module.exports = { signUp, login, protect, allowed };
