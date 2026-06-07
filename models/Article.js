const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String, default: '' },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => { ret.id = ret._id; delete ret._id; return ret; },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => { ret.id = ret._id; delete ret._id; return ret; },
    },
  }
);

module.exports = mongoose.model('Article', ArticleSchema);
