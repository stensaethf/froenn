/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Comment Schema
 */

var CommentSchema = new Schema({
  body: String,
  ts: { type: Date, default: Date.now },
  author: String,
  post: {type: Schema.Types.ObjectId, ref: 'Post'}
}, { strict: false });

CommentSchema.index({ body: 1 }, { unique: true });

mongoose.model('Comment', CommentSchema, 'comments');