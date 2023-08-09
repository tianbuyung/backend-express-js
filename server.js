// third party modules
const express = require("express");
const app = express();
const cors = require("cors");

// core modules
const path = require("path");

// custom modules
const { logger } = require("./middlewares/logEvents");
const errorHandler = require("./middlewares/errorHandler");

const PORT = process.env.PORT || 3500;

// custom middlewares logger
app.use(logger);

// Cross Origin Resource Sharing
// app.use(cors()); for public api

// cors with whitelist
const whitelist = [
  "https://www.yoursite.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];

const corsOptions = {
  origin: (origin, callback) => {
    // or handling undefined origin for dev mode
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// built-in middleware to handle urlencoded data
// in other words, form data:
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// built-in middleware for serve static files
app.use(express.static(path.join(__dirname, "/public")));
// link css or any static public files into subdir
app.use("/subdir", express.static(path.join(__dirname, "/public")));

// import root router
app.use("/", require("./routes/root"));
// import subdir router
app.use("/subdir", require("./routes/subdir"));
app.use("/employees", require("./routes/api/employees"));

// All routes not defined will be redirected to the 404
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// error handlers
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
