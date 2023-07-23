// third party modules
const express = require("express");
const app = express();

// core modules
const path = require("path");

// custom modules
const logEvents = require("./middlewares/logEvents");

const PORT = process.env.PORT || 3500;

// custom middlewares logger
app.use((req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method} ${req.url}`);
  next();
});

// built-in middleware to handle urlencoded data
// in other words, form data:
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// built-in middleware for serve static files
app.use(express.static(path.join(__dirname, "/public")));

// Define routes (express handling routes like waterfall)
// app.get("/", (req, res) => {
//   // res.sendFile("./views/index.html", { root: __dirname });
//   res.sendFile(path.join(__dirname, "views", "index.html"));
// });

// This route is for the homepage and regex can understand the path with "/" or "/index" or "/index.html"
app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// This route is for the new-page and regex can understand the path with "/new-page" or "/new-page.html"
app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html"); // by default redirect to new-page.html with status code 302
});

// routes handler
app.get(
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

app.get("/chain(.html)?", [one, two, three]);

// All routes not defined will be redirected to the 404
app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
