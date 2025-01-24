const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name cannot be empty!"],
  },
  description: {
    type: String,
    required: [true, "Provide product description!"],
  },
  price: {
    type: Number,
    required: [true, "Product price cannot be empty!"],
    maxlength: [6, "Price cannot be exceed 6 characters!"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  image: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Product Category required!"],
  },
  stock: {
    type: Number,
    required: [true, "Product Stock required!"],
    maxlength: [2, "Stock cannot be exceed 2 characters!"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
