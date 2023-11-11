const router = require("express").Router();
const { signUp, login } = require("../services/authServices");

const { signupVal, loginVal } = require("../utils/validators/authValidation");

router.post("/signup", signupVal, signUp)
router.post("/login", loginVal, login)

// router
//   .route("/:id")
//   .get(specificUesrVal, specificuser)
//   .put(uplodeImage, resizeImage, updateUesrVal, updateuser)
//   .delete(deleteUesrVal, deleteuser);

module.exports = router;
