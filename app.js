require("dotenv").config();

const express = require("express");
const { engine } = require("express-handlebars");

const bookRoutes = require("./routes/bookRoutes");

const app = express();


// =========================
// Handlebars configuration
// =========================
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main"
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");


// =========================
// Middleware
// =========================
app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.json());

app.use(express.static("public"));


// =========================
// Routes
// =========================
app.get("/", (req, res) => {
  res.redirect("/books");
});

app.use("/", bookRoutes);


// =========================
// Start server
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});