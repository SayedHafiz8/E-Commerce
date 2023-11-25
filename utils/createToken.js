const jwt = require("jsonwebtoken");

const createToken = (paylode) =>
  jwt.sign({ userId: paylode }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRE_TIME,
  });

module.exports = createToken