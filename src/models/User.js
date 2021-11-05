const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Define Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//Hash password before save in DB
userSchema.pre('save', (next) => {
  const user = this;

  if(this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, (saltError, salt) => {
      if(saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, (hashError, hash) => {
          if(hashError) {
            return next(hashError);
          } 

          user.password = hash;
          next();  
        });
      }
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = (password, callback) => {
  bcrypt.compare(password, this.password, (error, isMatch) => {
    if(error) {
      return callback(error);
    } else {
      callback(null, isMatch);
    }
  });
}