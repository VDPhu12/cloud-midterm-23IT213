const express = require("express");
const router = express.Router();

const {
  readConnection,
  writeConnection
} = require("../config/database");

const bookSchema = require("../models/book");

const ReadBook = readConnection.model(
  "ReadBook",
  bookSchema,
  "books"
);

const WriteBook = writeConnection.model(
  "WriteBook",
  bookSchema,
  "books"
);

const STUDENT_ID = process.env.STUDENT_ID;
const STUDENT_NAME = process.env.STUDENT_NAME;

const PRODUCT_PREFIX = STUDENT_ID.slice(-3);
const LAST_DIGIT = parseInt(STUDENT_ID.slice(-1), 10);

const VAT_PERCENT = LAST_DIGIT + 5;
const VAT_RATE = VAT_PERCENT / 100;



// =========================
// GET: Book list
// Uses READ-ONLY account
// =========================
router.get("/books", async (req, res) => {
  try {
    req.session.studentId = STUDENT_ID;
    const books = await ReadBook
      .find()
      .sort({ createdAt: -1 })
      .lean();

    res.render("books", {
      books,
      studentName: STUDENT_NAME,
      studentId: STUDENT_ID,
      vat: VAT_PERCENT
    });

  } catch (error) {
    console.error("READ ERROR:", error);

    res.status(500).render("error", {
      message: error.message
    });
  }
});


// =========================
// GET: Add book form
// =========================
router.get("/books/add", (req, res) => {
  res.render("add-book", {
    prefix: PRODUCT_PREFIX,
    vat: VAT_PERCENT,
    studentName: STUDENT_NAME,
    studentId: STUDENT_ID
  });
});


// =========================
// POST: Add new book
// Uses WRITE-ONLY account
// =========================
router.post("/books", async (req, res) => {
  try {
    const {
      code,
      name,
      author,
      price
    } = req.body;

    // Validate MSSV prefix
    if (!code.startsWith(PRODUCT_PREFIX)) {
      return res.status(400).render("error", {
        message: `Book code must start with ${PRODUCT_PREFIX}`
      });
    }

    const numericPrice = Number(price);

    if (
      Number.isNaN(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).render("error", {
        message: "Invalid book price"
      });
    }

    // Dynamic VAT calculation
    const priceAfterTax =
      numericPrice * (1 + VAT_RATE);

    await WriteBook.create({
      code,
      name,
      author,
      price: numericPrice,
      vat: VAT_PERCENT,
      priceAfterTax: Math.round(priceAfterTax)
    });

    res.redirect("/books");

  } catch (error) {
    console.error("WRITE ERROR:", error);

    res.status(500).render("error", {
      message: error.message
    });
  }
});


// VERY IMPORTANT
module.exports = router;