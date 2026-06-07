const mongoose = require('mongoose');

const PricingPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    features: { type: [String], default: [] },
  },
  { _id: false }
);

const ToolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    officialUrl: { type: String, required: true },
    categoryId: { type: String, required: true },
    mainImage: { type: String, default: '' },
    gallery: { type: [String], default: [] },
    advantages: { type: [String], default: [] },
    disadvantages: { type: [String], default: [] },
    pricingType: { type: String, enum: ['Free', 'Paid', 'Freemium'], default: 'Free' },
    pricingPlans: { type: [PricingPlanSchema], default: [] },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
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

module.exports = mongoose.model('Tool', ToolSchema);
