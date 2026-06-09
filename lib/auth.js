const crypto = require('crypto');
const AdminSession = require('../models/AdminSession');

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;

  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  const hashBuffer = Buffer.from(hash, 'hex');
  const derivedBuffer = Buffer.from(derived, 'hex');

  if (hashBuffer.length !== derivedBuffer.length) return false;
  return crypto.timingSafeEqual(hashBuffer, derivedBuffer);
}

function createSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function createAdminSession(adminId) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await AdminSession.create({ adminId, token, expiresAt });

  return { token, expiresAt };
}

async function validateSessionToken(token) {
  if (!token) return null;

  return AdminSession.findOne({
    token,
    expiresAt: { $gt: new Date() },
  }).populate('adminId');
}

async function revokeSessionToken(token) {
  if (!token) return;
  await AdminSession.deleteOne({ token });
}

module.exports = {
  hashPassword,
  verifyPassword,
  createAdminSession,
  validateSessionToken,
  revokeSessionToken,
  SESSION_TTL_MS,
};
