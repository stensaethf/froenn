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
  body: String,
  ts: { type: Date, default: Date.now },
  author: {type: Schema.Types.ObjectId, ref: 'User'}
}, { strict: false });

postSchema.index({ title: 1 }, { unique: true });

mongoose.model('Post', postSchema, 'posts');