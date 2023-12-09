const { check } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

const createCopounVal = [
  check("name").notEmpty().withMessage("Copoun Name is required"),
];
