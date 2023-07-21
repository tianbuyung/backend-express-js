// third party modules
const express = require("express");
const app = express();

// core modules
const path = require("path");

const PORT = process.env.PORT || 3500;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
