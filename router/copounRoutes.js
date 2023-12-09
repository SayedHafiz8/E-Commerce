const router = require("express").Router();

const AuthServices = require("../services/authServices");
const {
  creatCopoun,
  deleteCopoun,
  getCopouns,
  specificCopoun,
  updateCopoun,
} = require("../services/copounServices");

// const {
//   createCopounVal,
//   deleteCopounyVal,
//   specificCopounVal,
//   updateCopounVal,
// } = require("../utils/validators/brandValidation");

router
  .route("/")
  .get(getCopouns)
  .post(
    AuthServices.protect,
    AuthServices.allowed("admin"),
    creatCopoun
  );

router
  .route("/:id")
  .get(specificCopoun)
  .put(
    AuthServices.protect,
    AuthServices.allowed("admin"),
    updateCopoun
  )
  .delete(
    AuthServices.protect,
    AuthServices.allowed("admin"),
    deleteCopoun
  );

module.exports = router;
