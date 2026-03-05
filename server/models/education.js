/* ==========================================
   Model: Education
   ========================================== */
const pool = require('../config/db');

const Education = {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM education ORDER BY sort_order ASC, id ASC');
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM education WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async create({ icon, title, degree, year_range, sort_order }) {
        const [result] = await pool.query(
            'INSERT INTO education (icon, title, degree, year_range, sort_order) VALUES (?, ?, ?, ?, ?)',
            [icon || '', title, degree || '', year_range || '', sort_order || 0]
        );
        return { id: result.insertId, icon, title, degree, year_range, sort_order };
    },

    async update(id, { icon, title, degree, year_range, sort_order }) {
        await pool.query(
            'UPDATE education SET icon = ?, title = ?, degree = ?, year_range = ?, sort_order = ? WHERE id = ?',
            [icon || '', title, degree || '', year_range || '', sort_order || 0, id]
        );
        return this.getById(id);
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM education WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
};

module.exports = Education;
