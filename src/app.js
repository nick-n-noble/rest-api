const express = require("express");
const morgan = require("morgan");
const pkg = require("../package.json");
require("dotenv").config();
require("../config/database").connect(); //Connect to MongoDB

//Controllers
const user = require("./controllers/user.controller");
const auth = require("./controllers/auth.controller");

//Initialize express app
const app = express();

//Settings
app.set("pkg", pkg);

//Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes

//Welcome Route
app.get("/", auth, (req, res) => {
  res.json({
    author: app.get("pkg").author,
    name: app.get("pkg").name,
    description: app.get("pkg").description,
    version: app.get("pkg").version,
  });
});

app.post("/register", (req, res) => {
  user.register(req, res);
});

app.post("/login", (req, res) => {
  user.login(req, res);
})

app.get("/user/:username", auth, (req, res) => {
  user.getUserByUsername(req, res);
})

app.get("/get/username", auth, (req, res) => {
  user.getUsername(req, res);
})

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

module.exports = app;
