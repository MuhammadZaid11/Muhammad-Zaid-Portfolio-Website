/* ==========================================
   Route: Education CRUD
   ========================================== */
const express = require('express');
const Education = require('../models/education');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const items = await Education.getAll();
        res.json(items);
    } catch (err) {
        console.error('GET /education error:', err);
        res.status(500).json({ error: 'Failed to fetch education.' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const item = await Education.create(req.body);
        res.status(201).json(item);
    } catch (err) {
        console.error('POST /education error:', err);
        res.status(500).json({ error: 'Failed to create education.' });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const item = await Education.update(req.params.id, req.body);
        if (!item) return res.status(404).json({ error: 'Education not found.' });
        res.json(item);
    } catch (err) {
        console.error('PUT /education error:', err);
        res.status(500).json({ error: 'Failed to update education.' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Education.delete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Education not found.' });
        res.json({ message: 'Education deleted.' });
    } catch (err) {
        console.error('DELETE /education error:', err);
        res.status(500).json({ error: 'Failed to delete education.' });
    }
});

module.exports = router;
