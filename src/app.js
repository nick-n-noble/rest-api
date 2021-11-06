const express = require('express');
const morgan = require('morgan');
const pkg = require('../package.json');
require('dotenv').config();
require("../config/database").connect() //Connect to MongoDB


//Initialize express app
const app = express();

//Settings
app.set('pkg', pkg);

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


//Routes

//Welcome Route
app.get('/', (req, res) => {
  res.json({
    author: app.get('pkg').author,
    name: app.get('pkg').name,
    description: app.get('pkg').description,
    version: app.get('pkg').version
  });
});

module.exports = app;