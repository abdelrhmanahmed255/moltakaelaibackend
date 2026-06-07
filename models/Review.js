const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    toolId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true },
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

module.exports = mongoose.model('Review', ReviewSchema);
