const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: 'LayoutGrid' },
    description: { type: String, default: '' },
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

module.exports = mongoose.model('Category', CategorySchema);
