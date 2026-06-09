const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const Admin = require('../models/Admin');
const {
  verifyPassword,
  createAdminSession,
  revokeSessionToken,
} = require('../lib/auth');
const Tool = require('../models/Tool');
const Category = require('../models/Category');
const Article = require('../models/Article');
const Ad = require('../models/Ad');
const Settings = require('../models/Settings');
const Review = require('../models/Review');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' },
});

function extractBearerToken(req) {
  return (
    (req.headers.authorization || '').replace(/^Bearer\s+/i, '') ||
    req.headers['x-admin-secret'] ||
    ''
  );
}

// Public admin auth routes (no Bearer token required)
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const password = String(req.body?.password || '').trim();
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const admin = await Admin.findOne({ username: 'admin' });
    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const session = await createAdminSession(admin._id);
    return res.json({
      success: true,
      token: session.token,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const token = extractBearerToken(req);
    await revokeSessionToken(token);
    return res.json({ success: true });
  } catch (error) {
    console.error('Admin logout error:', error);
    return res.status(500).json({ error: 'Logout failed' });
  }
});

router.get('/verify', requireAdmin, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// All routes below require a valid admin session token
router.use(requireAdmin);

// ============ Tools ============
router.post('/tools', async (req, res) => {
  try {
    const tool = await Tool.create(req.body);
    res.status(201).json(tool);
  } catch (error) {
    console.error('Error creating tool:', error);
    res.status(500).json({ error: 'Failed to create tool' });
  }
});

router.put('/tools/:id', async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    res.json(tool);
  } catch (error) {
    console.error('Error updating tool:', error);
    res.status(500).json({ error: 'Failed to update tool' });
  }
});

router.delete('/tools/:id', async (req, res) => {
  try {
    await Tool.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting tool:', error);
    res.status(500).json({ error: 'Failed to delete tool' });
  }
});

// ============ Categories ============
router.post('/categories', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ============ Articles ============
router.post('/articles', async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

router.put('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

router.delete('/articles/:id', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// ============ Ads ============
router.post('/ads', async (req, res) => {
  try {
    const ad = await Ad.create(req.body);
    res.status(201).json(ad);
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).json({ error: 'Failed to create ad' });
  }
});

router.put('/ads/:id', async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }
    res.json(ad);
  } catch (error) {
    console.error('Error updating ad:', error);
    res.status(500).json({ error: 'Failed to update ad' });
  }
});

router.delete('/ads/:id', async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting ad:', error);
    res.status(500).json({ error: 'Failed to delete ad' });
  }
});

// ============ Settings ============
router.put('/settings', async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ============ Reviews (admin) ============
router.delete('/reviews/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
