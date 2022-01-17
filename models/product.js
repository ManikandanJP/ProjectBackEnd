const mongoose = require("mongoose");
const { ObjectId } = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 32,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      required: true,
    },
    price: {
      type: Number,
      trim: true,
      maxlength: 32,
      required: true,
    },
    stock: {
      type: Number,
    },
    soldunit: {
      type: Number,
      default: 0,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
