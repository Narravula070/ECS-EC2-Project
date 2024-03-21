const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Buddy This is Teja....!");
});

app.get("/me", (req, res) => {
  res.send("RCB EE SALAA CUP NAMDU....");
});

app.listen(5000, () => {
  console.log("listening");
});
