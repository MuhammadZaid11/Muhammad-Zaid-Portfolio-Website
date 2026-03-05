/* ==========================================
   Model: Project
   ========================================== */
const pool = require('../config/db');

const Project = {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM projects ORDER BY sort_order ASC, id ASC');
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async create({ title, description, tags, github_url, sort_order }) {
        const [result] = await pool.query(
            'INSERT INTO projects (title, description, tags, github_url, sort_order) VALUES (?, ?, ?, ?, ?)',
            [title, description || '', tags || '', github_url || '', sort_order || 0]
        );
        return { id: result.insertId, title, description, tags, github_url, sort_order };
    },

    async update(id, { title, description, tags, github_url, sort_order }) {
        await pool.query(
            'UPDATE projects SET title = ?, description = ?, tags = ?, github_url = ?, sort_order = ? WHERE id = ?',
            [title, description || '', tags || '', github_url || '', sort_order || 0, id]
        );
        return this.getById(id);
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
};

module.exports = Project;
