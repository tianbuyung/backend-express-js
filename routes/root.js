// create root router
const express = require("express");
const router = express.Router();
const path = require("path");

// Define routes (express handling routes like waterfall)
// app.get("/", (req, res) => {
//   // res.sendFile("./views/index.html", { root: __dirname });
//   res.sendFile(path.join(__dirname, "views", "index.html"));
// });

// This route is for the homepage and regex can understand the path with "/" or "/index" or "/index.html"
router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

// This route is for the new-page and regex can understand the path with "/new-page" or "/new-page.html"
router.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});

router.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html"); // by default redirect to new-page.html with status code 302
});

// routes handler
router.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attempted to load hello.html");
    next();
  },
  (req, res) => {
    res.send("Hello World!");
  }
);

// chaining route handlers
const one = (req, res, next) => {
  console.log("one");
  next();
};

const two = (req, res, next) => {
  console.log("two");
  next();
};

const three = (req, res) => {
  console.log("three");
  res.send("Finished!");
};

router.get("/chain(.html)?", [one, two, three]);

module.exports = router;
