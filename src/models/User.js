const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const  SALT_WORK_FACTOR = 10;

//Define Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

//Hash password before save in DB
userSchema.pre('save', function(next) {
  const user = this;

  //Only has the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  //Generate a salt 
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    //Hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      //Override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

//check if input password and password on DB match
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
}

module.exports = mongoose.model('User', userSchema);