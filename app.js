require("dotenv").config(); // Load environment variables
const express = require("express");
const app = express();
const connectDB = require("./db"); // Import the database connection
const indexRouter = require("./routes/index");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

connectDB(); //Make Conncetion to Database

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // For parsing application/json
app.use(cookieParser());

// Serve static files
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

// Serve static files from the public directory
app.use(express.static("public"));
// app.use(express.static("qr_images"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/logos", express.static(path.join(__dirname, "logos")));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Use routes from the index.js file
app.use("/", indexRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
