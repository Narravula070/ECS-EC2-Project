const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello this is kranthi_champ");
});

app.get("/me", (req, res) => {
  res.send("keep learning champs");
});

app.listen(5000, () => {
  console.log("listening");
});
