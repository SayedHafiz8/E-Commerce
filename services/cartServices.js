const asyncHandler = require("express-async-handler");
const model = require("../model/cartModel");
const Product = require("../model/productModel");
const Copoun = require("../model/copounModel");
const ApiErrors = require("../utils/apiErros");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDisc = undefined;
  return totalPrice;
};

const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  let cart = await model.findOne({ user: req.user._id });
  if (!cart) {
    cart = await model.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() == productId && item.color == color
    );
    if (productIndex >= 0) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    msg: "product added to cart successfully",
    data: cart,
  });
});
const getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await model.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiErrors(`There is no cart for this user id ${req.user._id}`, 404)
    );
  }
  res.status(200).json({ numOfCartItems: cart.cartItems.length, data: cart });
});
const removeOneCartItem = asyncHandler(async (req, res, next) => {
  const cart = await model.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await model.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});
const updateCartItemQuant = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await model.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiErrors("Ther is no cart for this user", 404));
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() == req.params.itemId
  );
  if (itemIndex >= 0) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(new ApiErrors("Ther is no item for this user", 404));
  }
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
const applyCopoun = asyncHandler(async (req, res, next) => {
  const copoun = await Copoun.findOne({
    name: req.body.copoun,
    expire: { $gt: Date.now() },
  });
  if (!copoun) {
    return next(new ApiErrors("This copoun is invalid or expire", 404));
  }
  const cart = await model.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  const totalCartPriceAfterDisc = (
    totalPrice -
    (totalPrice * copoun.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDisc = totalCartPriceAfterDisc;

  await cart.save();
  res
    .status(200)
    .json({
      status: "success",
      numOfCartItems: cart.cartItems.length,
      data: cart,
    });
});

module.exports = {
  addProductToCart,
  getLoggedUserCart,
  removeOneCartItem,
  clearCart,
  updateCartItemQuant,
  applyCopoun
};
