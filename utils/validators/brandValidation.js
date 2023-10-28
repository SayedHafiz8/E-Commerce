const { check } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const slugify = require("slugify");

const specificBrandVal = [
    check('id').isMongoId().withMessage("Invalid Brand id format"),
    validationMiddleware
];
const createBrandVal = [
    check("name").notEmpty().withMessage("name is required")
    .isLength({max: 32}).withMessage("Too long message name")
    .custom((val, {req}) => {
        req.body.slug = slugify(val)
        return true;
    })
    .isLength({min: 3}).withMessage("Too short message name"),
    validationMiddleware
];
const updateBrandVal = [
    check('id').isMongoId().withMessage("Invalid Brand id format"),
    check("name").notEmpty().withMessage("name is required")
    .custom((val, {req}) => {
        req.body.slug = slugify(val)
        return true;
    })
    .isLength({max: 32}).withMessage("Too long message name")
    .isLength({min: 3}).withMessage("Too short message name"),
    validationMiddleware
];
const deleteBrandyVal = [
    check('id').isMongoId().withMessage("Invalid Brand id format"),
    validationMiddleware
];
module.exports = {
    specificBrandVal,
    updateBrandVal,
    createBrandVal,
    deleteBrandyVal
}