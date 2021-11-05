const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => {
    console.log("Database connection Success.");
  })
  .catch((err) => {
    console.error("Mongo Connection Error", err);
  });

//Initialize express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get("/ping", (req, res) => {
    return res.send({
        error: false,
        message: "Server is healthy",
    });
});

app.listen(PORT, () => {
    console.log("Server started listening on PORT : " + PORT);
})