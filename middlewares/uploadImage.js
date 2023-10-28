const multer = require("multer");
const ApiErrors = require("../utils/apiErros");

const multerOptions = () => {
  const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiErrors("Only images allowed", 404), false);
    }
  };

  // memory storage engine ( for getting buffer )
  const storage = multer.memoryStorage();

  const upload = multer({ storage: storage, fileFilter });
  return upload;
};

const uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

const uploadFieldsImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);

module.exports = {
  uploadSingleImage,
  uploadFieldsImages,
};
