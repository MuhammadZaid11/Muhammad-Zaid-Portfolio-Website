/* ==========================================
   Model: User (Admin)
   ========================================== */
const pool = require('../config/db');

const User = {
    async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0] || null;
    },

    async create({ email, password_hash }) {
        const [result] = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES (?, ?)',
            [email, password_hash]
        );
        return { id: result.insertId, email };
    },
};

module.exports = User;
