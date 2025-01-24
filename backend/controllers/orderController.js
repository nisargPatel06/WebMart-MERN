const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await orderModel.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({ success: true, order });
});

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate("user", "name email");
  if (!order) {
    return next(new ErrorHandler("Order not found!", 404));
  }
  res.status(200).json({ success: true, order });
});

// Get Logged In User Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user._id });
  res.status(200).json({ success: true, orders });
});

// Get All Orders - Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderModel.find().populate("user", "name");

  let totalAmount = 0;
  orders.forEach((order) => (totalAmount += order.totalPrice));

  res.status(200).json({ success: true, totalAmount, orders });
});

// Update Order Status - Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found!", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler("You have already delivered this order..", 400)
    );
  }

  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });
  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save();
  res.status(200).json({ success: true });
});

async function updateStock(id, quantity) {
  const product = await productModel.findById(id);
  product.stock -= quantity;
  await product.save();
}

// Remove Order - Admin
exports.removeOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found!", 404));
  }
  await orderModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Order Removed.." });
});
