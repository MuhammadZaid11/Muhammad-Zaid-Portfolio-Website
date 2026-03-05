/* ==========================================
   Model: Experience
   ========================================== */
const pool = require('../config/db');

const Experience = {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM experience ORDER BY sort_order ASC, id ASC');
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM experience WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async create({ role, company, date_range, description, tags, sort_order }) {
        const [result] = await pool.query(
            'INSERT INTO experience (role, company, date_range, description, tags, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
            [role, company || '', date_range || '', description || '', tags || '', sort_order || 0]
        );
        return { id: result.insertId, role, company, date_range, description, tags, sort_order };
    },

    async update(id, { role, company, date_range, description, tags, sort_order }) {
        await pool.query(
            'UPDATE experience SET role = ?, company = ?, date_range = ?, description = ?, tags = ?, sort_order = ? WHERE id = ?',
            [role, company || '', date_range || '', description || '', tags || '', sort_order || 0, id]
        );
        return this.getById(id);
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM experience WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
};

module.exports = Experience;
