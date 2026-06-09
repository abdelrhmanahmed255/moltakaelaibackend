const Admin = require('../models/Admin');
const { hashPassword } = require('./auth');

const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = '1182019@@_';

async function ensureDefaultAdmin() {
  const existing = await Admin.findOne({ username: DEFAULT_USERNAME });
  if (existing) return;

  await Admin.create({
    username: DEFAULT_USERNAME,
    passwordHash: hashPassword(DEFAULT_PASSWORD),
  });

  console.log(`✅ Default admin account created (username: ${DEFAULT_USERNAME})`);
}

module.exports = { ensureDefaultAdmin, DEFAULT_USERNAME, DEFAULT_PASSWORD };
