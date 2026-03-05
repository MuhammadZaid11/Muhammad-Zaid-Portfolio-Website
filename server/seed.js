/* ==========================================
   Seed Script — Creates Default Admin User
   ==========================================
   Run: node server/seed.js
   Includes retry logic for Docker startup.
   ========================================== */
require('dotenv').config();

const bcrypt = require('bcryptjs');
const pool = require('./config/db');

const MAX_RETRIES = 30;
const RETRY_DELAY = 3000; // 3 seconds

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForTables() {
    for (let i = 1; i <= MAX_RETRIES; i++) {
        try {
            await pool.query('SELECT 1 FROM users LIMIT 1');
            return true;
        } catch (err) {
            console.log(`⏳ Waiting for database tables... (attempt ${i}/${MAX_RETRIES})`);
            await sleep(RETRY_DELAY);
        }
    }
    return false;
}

async function seed() {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    try {
        // Wait for MySQL init scripts to finish creating tables
        const tablesReady = await waitForTables();
        if (!tablesReady) {
            console.error('❌ Database tables not ready after maximum retries. Make sure schema.sql has been executed.');
            process.exit(1);
        }

        // Check if user already exists
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

        if (existing.length > 0) {
            console.log(`✅ Admin user already exists: ${email}`);
        } else {
            const hash = await bcrypt.hash(password, 12);
            await pool.query('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hash]);
            console.log(`✅ Admin user created: ${email}`);
        }

        console.log('🌱 Seed completed.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
