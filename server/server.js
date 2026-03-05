/* ==========================================
   MUHAMMAD ZAID PORTFOLIO — EXPRESS SERVER
   ==========================================
   Production-ready Node.js + MySQL backend
   ========================================== */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* ---------- Static Files (Frontend) ---------- */
app.use(express.static(path.join(__dirname, '..', 'public')));

/* ---------- API Routes ---------- */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/education', require('./routes/education'));
app.use('/api/certifications', require('./routes/certifications'));
app.use('/api/content', require('./routes/content'));

/* ---------- Health Check ---------- */
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ---------- SPA Fallback ---------- */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

/* ---------- Global Error Handler ---------- */
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error.' });
});

/* ---------- Start Server ---------- */
app.listen(PORT, () => {
    console.log(`\n🚀 Portfolio server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from /public`);
    console.log(`🔗 API available at http://localhost:${PORT}/api\n`);
});
