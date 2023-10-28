const { check } = require('express-validator');
const validationMiddleware = require("../../middlewares/validationMiddleware");
const slugify = require("slugify");

const createSubCategVal = [
    check("name").notEmpty().withMessage("name is required")
    .custom((val, {req}) => {
        req.body.slug = slugify(val)
        return true;
    })
    .isLength({max: 32}).withMessage("Too long message name")
    .isLength({min: 3}).withMessage("Too short message name"),
    check("category").notEmpty().withMessage("sub category must have a parent category")
    .isMongoId().withMessage("Invalid category id format"),
    validationMiddleware
];
const specificSubCategVal = [
    check('id').isMongoId().notEmpty().withMessage("Invalid sub category id format"),
    validationMiddleware
];
const updateSubcategVal = [
    check('id').isMongoId().notEmpty().withMessage("Invalid sub category id format"),
    check("name").notEmpty().withMessage("name is required")
    .custom((val, {req}) => {
        req.body.slug = slugify(val)
        return true;
    })
    .isLength({max: 32}).withMessage("Too long message name")
    .isLength({min: 3}).withMessage("Too short message name"),
    check("category").notEmpty().withMessage("sub category must have a parent category")
    .isMongoId().withMessage("Invalid category id format"),
    validationMiddleware
];
const deleteSubCategVal = [
    check('id').isMongoId().notEmpty().withMessage("Invalid sub category id format"),
    validationMiddleware
];


module.exports = {
    createSubCategVal,
    deleteSubCategVal,
    specificSubCategVal,
    updateSubcategVal
}