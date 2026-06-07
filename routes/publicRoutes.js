const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');
const Category = require('../models/Category');
const Article = require('../models/Article');
const Ad = require('../models/Ad');
const Settings = require('../models/Settings');
const Review = require('../models/Review');

// Health check
router.get('/status', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Settings
router.get('/settings', async (_req, res) => {
  try {
    const settings = await Settings.findOne().lean();
    res.json(settings || {});
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Tools
router.get('/tools', async (req, res) => {
  try {
    const filter = {};
    if (req.query.categoryId) {
      filter.categoryId = String(req.query.categoryId);
    }
    if (req.query.featured === 'true') {
      filter.isFeatured = true;
    }
    if (req.query.search) {
      const search = new RegExp(String(req.query.search), 'i');
      filter.$or = [
        { name: search },
        { slug: search },
        { description: search },
        { shortDescription: search },
      ];
    }
    const tools = await Tool.find(filter).sort({ createdAt: -1 }).lean();
    res.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ error: 'Failed to fetch tools' });
  }
});

router.get('/tools/:slug', async (req, res) => {
  try {
    const tool = await Tool.findOne({ slug: req.params.slug }).lean();
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    res.json(tool);
  } catch (error) {
    console.error('Error fetching tool:', error);
    res.status(500).json({ error: 'Failed to fetch tool' });
  }
});

// Categories
router.get('/categories', async (_req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Articles
router.get('/articles', async (_req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).lean();
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

router.get('/articles/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug }).lean();
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Ads (active only)
router.get('/ads', async (_req, res) => {
  try {
    const ads = await Ad.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    res.json(ads);
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
});

// Reviews
router.get('/reviews', async (req, res) => {
  try {
    const filter = {};
    if (req.query.toolId) {
      filter.toolId = String(req.query.toolId);
    }
    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Public review submission (no admin auth)
router.post('/reviews', async (req, res) => {
  try {
    const { toolId, userName, rating, comment } = req.body;
    if (!toolId || !userName || rating == null || !comment) {
      return res.status(400).json({ error: 'Missing required fields: toolId, userName, rating, comment' });
    }
    const review = await Review.create({ toolId, userName, rating, comment });
    // Update tool reviewsCount
    await Tool.findByIdAndUpdate(toolId, { $inc: { reviewsCount: 1 } }).catch(() => {
      // Also try by matching a different ID format (Mongo ObjectId might not match toolId string)
      // This is best-effort
    });
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

module.exports = router;
