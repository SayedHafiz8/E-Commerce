const { check } = require('express-validator');
const validationMiddleware = require("../../middlewares/validationMiddleware")
const slugify = require("slugify");

const specificCategoryVal = [
    check('id').isMongoId().withMessage("Invalid category id format"),
    validationMiddleware
];
const createCategoryVal = [
    check("name").notEmpty().withMessage("name is required")
    .isLength({max: 32}).withMessage("Too long message name")
    .custom((val, {req}) => {
        req.body.slug = slugify(val)
        return true;
    })
    .isLength({min: 3}).withMessage("Too short message name"),
    validationMiddleware
];
const updateCategoryVal = [
    check('id').isMongoId().withMessage("Invalid category id format"),
    check("name").notEmpty().withMessage("name is required")
    .custom((val, {req}) => {
        req.body.slug = slugify(val)
        return true;
    })
    .isLength({max: 32}).withMessage("Too long message name")
    .isLength({min: 3}).withMessage("Too short message name"),
    validationMiddleware
];
const deleteCategoryVal = [
    check('id').isMongoId().withMessage("Invalid category id format"),
    validationMiddleware
];
module.exports = {
    specificCategoryVal,
    updateCategoryVal,
    createCategoryVal,
    deleteCategoryVal
}