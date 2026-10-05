const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    author: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    vat: {
      type: Number,
      required: true
    },

    priceAfterTax: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = bookSchema;