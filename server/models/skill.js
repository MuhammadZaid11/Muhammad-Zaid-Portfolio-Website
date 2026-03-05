/* ==========================================
   Model: Skill Category
   ========================================== */
const pool = require('../config/db');

const Skill = {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM skills ORDER BY sort_order ASC, id ASC');
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM skills WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async create({ name, icon, css_class, items, sort_order }) {
        const [result] = await pool.query(
            'INSERT INTO skills (name, icon, css_class, items, sort_order) VALUES (?, ?, ?, ?, ?)',
            [name, icon || '', css_class || '', items || '', sort_order || 0]
        );
        return { id: result.insertId, name, icon, css_class, items, sort_order };
    },

    async update(id, { name, icon, css_class, items, sort_order }) {
        await pool.query(
            'UPDATE skills SET name = ?, icon = ?, css_class = ?, items = ?, sort_order = ? WHERE id = ?',
            [name, icon || '', css_class || '', items || '', sort_order || 0, id]
        );
        return this.getById(id);
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM skills WHERE id = ?', [id]);
        return result.affectedRows > 0;
    },
};

module.exports = Skill;
