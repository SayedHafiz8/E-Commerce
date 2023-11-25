const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const model = require("../model/userModel");
const ApiErrors = require("../utils/apiErros");
const sendEmail = require("../utils/sendEmail");

const createToken = (paylode) => {
  jwt.sign({ userId: paylode }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRE_TIME,
  });
}

const signUp = asyncHandler(async (req, res, next) => {
  // 1- create user
  const user = await model.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2- Generate token
  const token = createToken(user._id)

  res.status(201).json({ data: user, token });
});

const login = asyncHandler(async (req, res, next) => {
  const user = await model.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiErrors("Incorrect email or password"));
  }
  const token = createToken(user._id)

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

const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await model.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiErrors(`There is no user with this email ${req.body.email}`)
    );
  }

  // 2) Generate hash 6 random digit numbers and save in database
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetHashCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passResetCode = resetHashCode;
  user.passResetExp = Date.now() + 10 * 60 * 1000;
  user.passResetVerify = false;

  await user.save();

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code valid for 10 min",
      text: `Hi ${user.name}.\n We received a request to reset the password on your 7afiz-shop account. \n ${resetCode}.\n 7afiz-shop team`,
    });
  } catch (error) {
    user.passResetCode = undefined;
    user.passResetExp = undefined;
    user.passResetVerify = undefined;

    await user.save();
    return next(new ApiErrors("There is an error in sendig the email", 500));
  }
  res
    .status(200)
    .json({ status: "success", message: "Reset codee send to email" });
});

const verifyResetPass = asyncHandler(async (req, res, next) => {
  const resetHashCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await model.findOne({
    passResetCode: resetHashCode,
    passResetExp: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiErrors("Your reset code invalid or expired"));
  }
  user.passResetVerify = true;
  await user.save();
  res.status(200).json({ status: "success" });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await model.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiErrors(`There is no user with this email ${req.body.email}`, 404)
    );
  }
  if (!user.passResetVerify) {
    return next(new ApiErrors("reset code not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passResetCode = undefined;
  user.passResetExp = undefined;
  user.passResetVerify = undefined;

  await user.save();

  const token = createToken(user._id)
  res.status(200).json({user, token})
});
module.exports = {
  signUp,
  login,
  protect,
  allowed,
  forgotPassword,
  verifyResetPass,
  resetPassword
};
