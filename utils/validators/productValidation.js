const { check } =  require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const Category = require("../../model/categoryModel");
const SubCategory = require("../../model/subCategoryModel");
const slugify = require("slugify");


const createProductVal = [
    check("title")
    .isLength({min: 3}).withMessage("Too short product title")
    .custom((val, {req}) => {
        req.body.slug = slugify(val)
        return true;
    })
    .isLength({max: 100}).withMessage("Too long product title")
    .notEmpty().withMessage("Title required"),
    check("description")
    .isLength({min: 30}).withMessage("Too short product description")
    .notEmpty().withMessage("product descrition required"),
    check("quantity")
    .isNumeric().withMessage("The qantity must be number")
    .notEmpty().withMessage("product quantity required"),
    check("colors")
    .isArray().withMessage("Product colors must be in array")
    .optional(),
    check("sold")
    .optional()
    .isNumeric().withMessage("product sold must be number"),
    check("price")
    .notEmpty().withMessage("product price required")
    .isNumeric().withMessage("product price must be number"),
    check("priceAfterDisc")
    .optional()
    .isNumeric().withMessage("poduct price after discount must be number")
    .toFloat()
    .custom((value, {req}) => {
        if (req.body.price <= value) {
            throw new Error("price after discount must be lower than price")
        }
        return true
    }),
    check("imageCover")
    .notEmpty().withMessage("imageCover must be required"),
    check("images")
    .optional()
    .isArray().withMessage("imges must be in array"),
    check("rataingAvarge")
    .isNumeric().withMessage("rating must be number")
    .isLength({min: 1}).withMessage("Rate must be between 1.0 and 5.0")
    .isLength({max: 5}).withMessage("Rate must be between 1.0 and 5.0"),
    check("rataingQuantity")
    .optional()
    .isNumeric().withMessage("rating must be number"),
    check("category")
    .notEmpty().withMessage("product must be belong to category")
    .isMongoId().withMessage("Invalid id format")
    .custom((categoryId) => 
        Category.findById(categoryId).then((category) => {
            if (!category) {
                return Promise.reject(new Error(`No category for this id ${categoryId}`));
            }
        })
    ),
    check("subCategory")
    .optional()
    .isMongoId().withMessage("Invalid id format")
    .custom((subCategoryId) => 
        SubCategory.find({_id: {$exists: true, $in: subCategoryId}}).then((result) => {
            if (result.length < 1 || result.length !== subCategoryId.length) {
                return Promise.reject(new Error(`Invalid sub categories ids`));
            }
        })
    )
    .custom((val, { req }) =>
        SubCategory.find({category: req.body.category}).then((subCategories) => {
            const subcatInDB = [];
            subCategories.forEach((subCategory) => {
                subcatInDB.push(subCategory._id.toString())
            })
            const result = val.every(v => subcatInDB.includes( v ))
            if (! result) {
                return Promise.reject(new Error(`subcategories not belong to category`));
            }
        })
    ),
    check("brand")
    .optional()
    .isMongoId().withMessage("Invalid id format"),
    validationMiddleware
];
const spcificProductVal = [
    check("id")
    .notEmpty().withMessage("Product id required")
    .isMongoId().withMessage("Invalid id format"),
    validationMiddleware
];
const updateProductVal = [
    check("id")
    .notEmpty().withMessage("Product id required")
    .isMongoId().withMessage("Invalid id format"),
    check("priceAfterDisc")
    .optional()
    .isNumeric().withMessage("poduct price after discount must be number")
    .toFloat()
    .custom((value, {req}) => {
        if (req.body.price <= value) {
            throw new Error("price after discount must be lower than price")
        }
        return true
    }),
    check("title")
    .optional()
    .custom((val, {req}) => {
        req.body.slug = slugify(val)
        return true;
    }),
    validationMiddleware
];
const deleteProductVal = [
    check("id")
    .notEmpty().withMessage("Product id required")
    .isMongoId().withMessage("Invalid id format"),
    validationMiddleware
];

module.exports = {
    createProductVal,
    deleteProductVal,
    spcificProductVal,
    updateProductVal
}
