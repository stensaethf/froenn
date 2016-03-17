/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */

var userSchema = new Schema({
  admin: { type: Boolean, default: false },
  email: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  f_n: String, // first name
  l_n: String // last name
}, { strict: false });

/**
 * Methods
 */

userSchema.methods = {
    // we need some way to encrypt the password.
};

userSchema.index({ email: 1 }, { unique: true });

mongoose.model('User', userSchema, 'users');