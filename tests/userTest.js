//TO RUN TEST MAKE SURE testAccount IS DELETED FROM DATABASE
const mongoose = require('mongoose');
const User = require('../src/models/User');
require('dotenv').config();

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

//create a test user
const testUser = new User({
  email: 'test.test@test.test',
  username: 'testAccount',
  password: 'Password'
});

//save user to the database
testUser.save((err) => {
  if (err) {
    console.log('delete test user and try again');
    throw err;
  } 
  //fetch user and test password verification
  User.findOne({ username: 'testAccount' }, function(err, user) {
    if (err) throw err;

  //test a matching password
    user.comparePassword('Password', (err, isMatch) => {
      if (err) throw err;
      console.log('Password: ', isMatch); //Password: true
    })

    //test a failing password
    user.comparePassword('Password123', (err, isMatch) => {
      if (err) throw err;
      console.log('Password123: ', isMatch);
    })
  });
});

