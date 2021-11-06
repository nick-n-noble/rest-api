const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

exports.connect = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('Database connection Success.');
    })
    .catch((err) => {
      console.log('Mongo Connection Error: ')
      console.error(err);
      process.exit(1);
    });
};
