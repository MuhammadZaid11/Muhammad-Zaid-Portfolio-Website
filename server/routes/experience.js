/* ==========================================
   Route: Experience CRUD
   ========================================== */
const express = require('express');
const Experience = require('../models/experience');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const items = await Experience.getAll();
        res.json(items);
    } catch (err) {
        console.error('GET /experience error:', err);
        res.status(500).json({ error: 'Failed to fetch experience.' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const item = await Experience.create(req.body);
        res.status(201).json(item);
    } catch (err) {
        console.error('POST /experience error:', err);
        res.status(500).json({ error: 'Failed to create experience.' });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const item = await Experience.update(req.params.id, req.body);
        if (!item) return res.status(404).json({ error: 'Experience not found.' });
        res.json(item);
    } catch (err) {
        console.error('PUT /experience error:', err);
        res.status(500).json({ error: 'Failed to update experience.' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Experience.delete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Experience not found.' });
        res.json({ message: 'Experience deleted.' });
    } catch (err) {
        console.error('DELETE /experience error:', err);
        res.status(500).json({ error: 'Failed to delete experience.' });
    }
});

module.exports = router;
