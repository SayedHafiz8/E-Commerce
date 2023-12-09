const mongoose = require("mongoose");

const copounSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Copoun name is required"],
      trim: true,
      unique: [true, "Copoun name must be unique"],
    },
    expire: {
      type: Date,
      required: [true, "Copoun expire time required"],
    },
    discount: {
      type: Number,
      required: [true, "Copoun dicount value required"],
    },
  },
  { timestamps: true }
);

const copounModel = mongoose.model('Copoun', copounSchema);

module.exports = copounModel
