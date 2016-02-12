/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Post Schema
 */

var postSchema = new Schema({
  title: String,
  slug: { type: String, required: true },
  body: String,
  ts: { type: Date, default: Date.now },
}, { strict: false });

postSchema.index({ title: 1 }, { unique: true });

mongoose.model('Post', postSchema, 'posts');