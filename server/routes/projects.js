/* ==========================================
   Route: Projects CRUD
   ========================================== */
const express = require('express');
const Project = require('../models/project');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/projects — public
router.get('/', async (req, res) => {
    try {
        const projects = await Project.getAll();
        res.json(projects);
    } catch (err) {
        console.error('GET /projects error:', err);
        res.status(500).json({ error: 'Failed to fetch projects.' });
    }
});

// POST /api/projects — protected
router.post('/', verifyToken, async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (err) {
        console.error('POST /projects error:', err);
        res.status(500).json({ error: 'Failed to create project.' });
    }
});

// PUT /api/projects/:id — protected
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const project = await Project.update(req.params.id, req.body);
        if (!project) return res.status(404).json({ error: 'Project not found.' });
        res.json(project);
    } catch (err) {
        console.error('PUT /projects error:', err);
        res.status(500).json({ error: 'Failed to update project.' });
    }
});

// DELETE /api/projects/:id — protected
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Project.delete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Project not found.' });
        res.json({ message: 'Project deleted.' });
    } catch (err) {
        console.error('DELETE /projects error:', err);
        res.status(500).json({ error: 'Failed to delete project.' });
    }
});

module.exports = router;
