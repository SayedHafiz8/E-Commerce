const router = require("express").Router();
const {
  signUp,
  login,
  forgotPassword,
  verifyResetPass,
  resetPassword
} = require("../services/authServices");

const { signupVal, loginVal } = require("../utils/validators/authValidation");

router.post("/signup", signupVal, signUp);
router.post("/login", loginVal, login);
router.post("/forgotPass", forgotPassword);
router.post("/verifyPass", verifyResetPass);
router.put("/resetPass", resetPassword);

// router
//   .route("/:id")
//   .get(specificUesrVal, specificuser)
//   .put(uplodeImage, resizeImage, updateUesrVal, updateuser)
//   .delete(deleteUesrVal, deleteuser);

module.exports = router;
