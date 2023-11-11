const path = require("path");

const express = require("express");
const ApiErrors = require("./utils/apiErros");
require("dotenv").config();
const globalHandel = require("./middlewares/ErrorMiddleware");
const app = express();

const dbConnection = require("./config/database");
dbConnection();
const categoryRouter = require("./router/categoryRouter");
const subCategriesRoutes = require("./router/subCategoiesRoutes");
const brandRoutes = require("./router/brandRoutes");
const productRoutes = require("./router/productRoutes");
const userRoutes = require("./router/userRoutes");
const authRoutes = require("./router/authRoutes");

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

app.use("/api/categories", categoryRouter);
app.use("/api/subCategories", subCategriesRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes)

// Genrate and Handeling the Error
app.all("*", (req, res, next) => {
  next(new ApiErrors(`Can't find this route: ${req.originalUrl}`, 400));
});
// Global handelling error
app.use(globalHandel);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is connected at port ${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Errors: ${err}`);
  server.close(() => {
    console.error("Shut down .....");
    process.exit(1);
  });
});
