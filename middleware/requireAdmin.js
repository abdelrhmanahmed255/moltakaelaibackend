function requireAdmin(req, res, next) {
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    return res.status(500).json({ error: 'Admin secret is not configured on server.' });
  }

  const token =
    (req.headers.authorization || '').replace(/^Bearer\s+/i, '') ||
    req.headers['x-admin-secret'];

  if (token !== adminSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

module.exports = requireAdmin;
