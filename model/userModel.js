const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      minLength: [3, "Too short user name"],
      maxLength: [32, "Too long user name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    profileImg: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email must be required"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password must be required"],
    },
    phone: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);
// Return image url in the response
const setImageUrl = (doc) => {
  if (doc.profileImg) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    console.log("dsdfdd")
    doc.profileImg = imageUrl;
  }
};
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 8)
  next()
})

userSchema.post("init", (doc) => {
  setImageUrl(doc);
});

userSchema.post("save", (doc) => {
  setImageUrl(doc);
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
