/* ==========================================
   Route: Content (JSON key-value sections)
   ========================================== */
const express = require('express');
const Content = require('../models/content');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

const VALID_SECTIONS = ['hero', 'about', 'contact', 'social', 'footer'];

// GET /api/content — get all content sections
router.get('/', async (req, res) => {
    try {
        const content = await Content.getAll();
        res.json(content);
    } catch (err) {
        console.error('GET /content error:', err);
        res.status(500).json({ error: 'Failed to fetch content.' });
    }
});

// GET /api/content/:section — get a specific section
router.get('/:section', async (req, res) => {
    try {
        const { section } = req.params;
        if (!VALID_SECTIONS.includes(section)) {
            return res.status(400).json({ error: `Invalid section. Must be one of: ${VALID_SECTIONS.join(', ')}` });
        }
        const data = await Content.get(section);
        if (!data) return res.status(404).json({ error: 'Section not found.' });
        res.json(data);
    } catch (err) {
        console.error('GET /content/:section error:', err);
        res.status(500).json({ error: 'Failed to fetch section.' });
    }
});

// PUT /api/content/:section — update a section (protected)
router.put('/:section', verifyToken, async (req, res) => {
    try {
        const { section } = req.params;
        if (!VALID_SECTIONS.includes(section)) {
            return res.status(400).json({ error: `Invalid section. Must be one of: ${VALID_SECTIONS.join(', ')}` });
        }
        const data = await Content.upsert(section, req.body);
        res.json(data);
    } catch (err) {
        console.error('PUT /content/:section error:', err);
        res.status(500).json({ error: 'Failed to update section.' });
    }
});

module.exports = router;
