/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Post Schema
 */

var PostSchema = new Schema({
  title: String,
  body: String,
  ts: { type: Date, default: Date.now },
  author: {type: Schema.Types.ObjectId, ref: 'User'}
}, { strict: false });

PostSchema.index({ title: 1 }, { unique: true });

mongoose.model('Post', PostSchema, 'posts');