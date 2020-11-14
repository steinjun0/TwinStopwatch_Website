const express = require("express");
const app = express();
const port = 3000;
var fs = require("fs");
//var template = require("./lib/template.js");

//route, routing
/*
app.get("/", (req, res) => {
  res.send("Hello World!");
});
*/
var router = require("./router/router")(app);
app.set("views", __dirname);
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.static("public"));
app.use(express.static("data"));

app.listen(3000, function () {
  console.log(`Example app listening at http://localhost:3000`);
});
