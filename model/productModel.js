const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "Too short product title"],
      maxLength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      minLength: [30, "Too short product title"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    colors: [String],
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    priceAfterDisc: {
      type: Number,
    },
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    ratingAvarge: {
      type: Number,
      required: true,
      min: [1, "Rate must be between 1.0 and 5.0"],
      max: [5, "Rate must be between 1.0 and 5.0"],
    },
    ratingQantity: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "Category must be required"],
    },
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
      requied: [true, "Brand must be required"],
    },
  },
  {
    timestamps: true,
    //  to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((element) => {
      const imageUrl = `${process.env.BASE_URL}/products/${element}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

productSchema.post("init", (doc) => {
  setImageUrl(doc);
});

productSchema.post("save", (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model("Product", productSchema);
