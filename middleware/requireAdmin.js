const { validateSessionToken } = require('../lib/auth');

async function requireAdmin(req, res, next) {
  try {
    const token =
      (req.headers.authorization || '').replace(/^Bearer\s+/i, '') ||
      req.headers['x-admin-secret'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const session = await validateSessionToken(token);
    if (!session || !session.adminId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.admin = session.adminId;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = requireAdmin;
