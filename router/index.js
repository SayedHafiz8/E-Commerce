const categoryRouter = require("./categoryRouter");
const subCategriesRoutes = require("./subCategoiesRoutes");
const brandRoutes = require("./brandRoutes");
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const reviewRoutes = require("./reviewRoutes");
const wishListRoutes = require("./wishListRoutes");
const addressRoutes = require("./addressRoutes");
const copounRoutes = require('./copounRoutes');
const cartRoutes = require('./cartRoutes');

const mountRoutes = (app) => {
  app.use("/api/categories", categoryRouter);
  app.use("/api/subCategories", subCategriesRoutes);
  app.use("/api/brands", brandRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/wishList", wishListRoutes);
  app.use("/api/addresses", addressRoutes);
  app.use('/api/copouns', copounRoutes)
  app.use('/api/cart', cartRoutes)
};

module.exports = mountRoutes;
