/* ==========================================
   Model: Content (JSON key-value sections)
   ========================================== */
const pool = require('../config/db');

const Content = {
    async get(sectionKey) {
        const [rows] = await pool.query('SELECT data FROM content WHERE section_key = ?', [sectionKey]);
        if (!rows[0]) return null;
        return typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
    },

    async getAll() {
        const [rows] = await pool.query('SELECT section_key, data FROM content');
        const result = {};
        rows.forEach((row) => {
            result[row.section_key] = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        });
        return result;
    },

    async upsert(sectionKey, data) {
        const jsonData = JSON.stringify(data);
        await pool.query(
            'INSERT INTO content (section_key, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = ?',
            [sectionKey, jsonData, jsonData]
        );
        return data;
    },
};

module.exports = Content;
