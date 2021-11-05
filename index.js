const express = require('express');
const morgan = require('morgan');
const pkg = require('./package.json');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Database connection Success.');
  })
  .catch((err) => {
    console.error('Mongo Connection Error', err);
  });


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

//Ping Route
app.get('/ping', (req, res) => {
  res.send({
    error: false,
    message: 'Server is healthy',
  });
});

app.listen(PORT, () => {
  console.log('Server started listening on PORT : ' + PORT);
})