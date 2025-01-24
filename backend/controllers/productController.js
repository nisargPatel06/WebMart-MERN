const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/ApiFeatures");
const cloudinary = require("../utils/cloudinary");

// Create Product : Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];
  if (typeof req.body.image === "string") {
    images.push(req.body.image);
  } else {
    images = req.body.image;
  }

  const imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "E-commerce/product-images",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.image = imagesLinks;
  req.body.user = req.user.id;

  const product = await productModel.create(req.body);
  res.status(201).json({ success: true, product });
});

// All Products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 8;
  const productsCount = await productModel.countDocuments();

  let apiFeature = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;
  let filteredProductsCount = products.length;
  apiFeature = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get All Products : Admin
exports.getAdminProducts = catchAsyncErrors(async (req, res) => {
  const products = await productModel.find();
  res.status(200).json({
    success: true,
    products,
  });
});

// One Product Details
exports.getOneProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found!", 404));
  }
  res.status(200).json({ success: true, product });
});

// Update Product : Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found!", 404));
  }

  if (req.body.image && req.body.image.length > 0) {
    for (let img of product.image) {
      await cloudinary.uploader.destroy(img.public_id);
    }
    const imagesLinks = await Promise.all(
      req.body.image.map(async (img) => {
        const result = await cloudinary.uploader.upload(img, {
          folder: "E-commerce/product-images",
        });
        return { public_id: result.public_id, url: result.secure_url };
      })
    );
    req.body.image = imagesLinks;
  } else {
    req.body.image = product.image; // Retain old images if no new images are provided
  }

  product = await productModel.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({ success: true, product });
});

// Remove Product : Admin
exports.removeProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found!", 404));
  }
  if (product.image.length > 0) {
    try {
      // Use Promise.all to wait for all image deletions to complete
      await Promise.all(
        product.image.map(async (img) => {
          await cloudinary.uploader.destroy(img.public_id);
        })
      );
    } catch (error) {
      return next(
        new ErrorHandler("Error removing product images from Cloudinary", 500)
      );
    }
  }
  await productModel.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: "Product Removed.." });
});

// Create New Review or Update Review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await productModel.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save();

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of Product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found!", 404));
  }

  res.status(200).json({ success: true, reviews: product.reviews });
});

// Remove Review
exports.removeReview = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found!", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg / reviews.length;
  const numOfReviews = reviews.length;

  await productModel.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews,
  });

  res.status(200).json({ success: true });
});
