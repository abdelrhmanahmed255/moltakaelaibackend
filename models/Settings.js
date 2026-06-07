const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: '' },
    siteTitle: { type: String, default: '' },
    siteDesc: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    isMaintenanceMode: { type: Boolean, default: false },
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
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

module.exports = mongoose.model('Settings', SettingsSchema);
