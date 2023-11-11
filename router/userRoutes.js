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
  changePasswordVal
} = require("../utils/validators/userValidation");

router.put("/changePassword/:id", changePasswordVal, changePassword)

router
  .route("/")
  .get(getusers)
  .post(uplodeImage, resizeImage, createUesrVal, creatuser);

router
  .route("/:id")
  .get(specificUesrVal, specificuser)
  .put(uplodeImage, resizeImage, updateUesrVal, updateuser)
  .delete(deleteUesrVal, deleteuser);

module.exports = router;
