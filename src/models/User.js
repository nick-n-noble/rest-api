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
userSchema.pre('save', (next) => {
  const user = this;

  //Only has the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  //Generate a salt 
  bcrypt.genSalt(SLAT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    //Hash the password along with our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      //Override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });

  // if(this.isModified("password") || this.isNew) {
  //   bcrypt.genSalt(10, (saltError, salt) => {
  //     if(saltError) {
  //       return next(saltError);
  //     } else {
  //       bcrypt.hash(user.password, salt, (hashError, hash) => {
  //         if(hashError) {
  //           return next(hashError);
  //         } 

  //         user.password = hash;
  //         next();  
  //       });
  //     }
  //   });
  // } else {
  //   return next();
  // }
});

userSchema.methods.comparePassword = (candidatePassword, cb) => {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  })
  
  
  
  
  // bcrypt.compare(password, this.password, (error, isMatch) => {
  //   if(error) {
  //     return callback(error);
  //   } else {
  //     callback(null, isMatch);
  //   }
  // });
}

module.exports = mongoose.model('User', userSchema);