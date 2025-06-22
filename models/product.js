const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  sku: {
    type: String,
    required: true, // Stock Keeping Unit
  },
  categories: {
    type: [String], // Array of categories the product belongs to
    default: [],
  },
  tags: {
    type: [String], // Array of tags
    default: [],
  },
  brand: {
    type: String,
  },
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // Allows for flexible attributes
  },
  specifications: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // Allows for flexible specifications
  },
  rating: {
    average: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    totalSold: {
      type: Number,
      default: 0,
    },
  },
  imageUrl: {
    type: String, // URL for the product image
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reviews: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }
]
});

// Create the Product Model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;