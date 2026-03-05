/* ==========================================
   Route: Certifications CRUD
   ========================================== */
const express = require('express');
const Certification = require('../models/certification');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const items = await Certification.getAll();
        res.json(items);
    } catch (err) {
        console.error('GET /certifications error:', err);
        res.status(500).json({ error: 'Failed to fetch certifications.' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const item = await Certification.create(req.body);
        res.status(201).json(item);
    } catch (err) {
        console.error('POST /certifications error:', err);
        res.status(500).json({ error: 'Failed to create certification.' });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const item = await Certification.update(req.params.id, req.body);
        if (!item) return res.status(404).json({ error: 'Certification not found.' });
        res.json(item);
    } catch (err) {
        console.error('PUT /certifications error:', err);
        res.status(500).json({ error: 'Failed to update certification.' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Certification.delete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Certification not found.' });
        res.json({ message: 'Certification deleted.' });
    } catch (err) {
        console.error('DELETE /certifications error:', err);
        res.status(500).json({ error: 'Failed to delete certification.' });
    }
});

module.exports = router;
