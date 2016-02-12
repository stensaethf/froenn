/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Post Schema
 */

var questionSchema = new Schema({
  title: String,
  slug: { type: String, required: true },
  body: String,
  ts: { type: Date, default: Date.now },
}, { strict: false });

mongoose.model('Post', questionSchema, 'posts');
