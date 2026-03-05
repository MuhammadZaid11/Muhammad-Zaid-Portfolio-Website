/* ==========================================
   Route: Skills CRUD
   ========================================== */
const express = require('express');
const Skill = require('../models/skill');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const skills = await Skill.getAll();
        res.json(skills);
    } catch (err) {
        console.error('GET /skills error:', err);
        res.status(500).json({ error: 'Failed to fetch skills.' });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const skill = await Skill.create(req.body);
        res.status(201).json(skill);
    } catch (err) {
        console.error('POST /skills error:', err);
        res.status(500).json({ error: 'Failed to create skill.' });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const skill = await Skill.update(req.params.id, req.body);
        if (!skill) return res.status(404).json({ error: 'Skill not found.' });
        res.json(skill);
    } catch (err) {
        console.error('PUT /skills error:', err);
        res.status(500).json({ error: 'Failed to update skill.' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Skill.delete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Skill not found.' });
        res.json({ message: 'Skill deleted.' });
    } catch (err) {
        console.error('DELETE /skills error:', err);
        res.status(500).json({ error: 'Failed to delete skill.' });
    }
});

module.exports = router;
