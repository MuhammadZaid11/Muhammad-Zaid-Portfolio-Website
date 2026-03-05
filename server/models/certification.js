/* ==========================================
   Model: Certification
   ========================================== */
const pool = require('../config/db');

const Certification = {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM certifications ORDER BY sort_order ASC, id ASC');
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM certifications WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async create({ name, sort_order }) {
        const [result] = await pool.query(
            'INSERT INTO certifications (name, sort_order) VALUES (?, ?)',
            [name, sort_order || 0]
        );
        return { id: result.insertId, name, sort_order };
    },

    async update(id, { name, sort_order }) {
        await pool.query(
            'UPDATE certifications SET name = ?, sort_order = ? WHERE id = ?',
            [name, sort_order || 0, id]
        );
        return this.getById(id);
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM certifications WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
};

module.exports = Certification;
