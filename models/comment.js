/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Comment Schema
 */

var commentSchema = new Schema({
  body: String,
  ts: { type: Date, default: Date.now },
  author: String
}, { strict: false });

commentSchema.index({ body: 1 }, { unique: true });

mongoose.model('Comment', commentSchema, 'comments');