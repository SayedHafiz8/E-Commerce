const router = require("express").Router();
const {
  creatuser,
  deleteuser,
  getusers,
  specificuser,
  updateuser,
  uplodeImage,
  resizeImage,
  changePassword,
} = require("../services/userServices");

const {
  createUesrVal,
  deleteUesrVal,
  specificUesrVal,
  updateUesrVal,
  changePasswordVal,
} = require("../utils/validators/userValidation");
const AuthServices = require("../services/authServices");

router.put("/changePassword/:id", changePasswordVal, changePassword);

router
  .route("/")
  .get(AuthServices.protect, AuthServices.allowed("admin"), getusers)
  .post(uplodeImage, resizeImage, createUesrVal, creatuser);

router
  .route("/:id")
  .get(
    AuthServices.protect,
    AuthServices.allowed("admin"),
    specificUesrVal,
    specificuser
  )
  .put(
    AuthServices.protect,
    AuthServices.allowed("admin"),
    uplodeImage,
    resizeImage,
    updateUesrVal,
    updateuser
  )
  .delete(
    AuthServices.protect,
    AuthServices.allowed("admin"),
    deleteUesrVal,
    deleteuser
  );

module.exports = router;
