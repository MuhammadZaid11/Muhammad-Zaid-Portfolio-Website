# 🚀 Deployment & Setup Guide

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- (Optional) [Node.js 20+](https://nodejs.org/) for local development without Docker

---

## Quick Start with Docker

### 1. Configure Environment Variables
```bash
cp .env.example .env
```
Edit `.env` and set secure values:
```env
DB_PASSWORD=your_strong_password
JWT_SECRET=a_random_64_char_string
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your_admin_password
```

### 2. Start the Application
```bash
docker-compose up --build
```
This will:
- Start MySQL 8.0 and run `schema.sql` (creates tables + seed data)
- Build and start the Node.js Express server
- Create the admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD`

### 3. Access the Application
- **Portfolio**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin.html
- **API Health Check**: http://localhost:3000/api/health

### 4. Stop the Application
```bash
docker-compose down       # Stop containers (keep data)
docker-compose down -v    # Stop containers AND delete database volume
```

---

## Local Development (Without Docker)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MySQL
Install MySQL 8.0 locally, then:
```bash
mysql -u root -p < schema.sql
```

### 3. Configure `.env`
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=portfolio_user
DB_PASSWORD=your_password
DB_NAME=portfolio_db
JWT_SECRET=your_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### 4. Seed Admin User
```bash
npm run seed
```

### 5. Start the Server
```bash
npm run dev     # Development (auto-restart on changes)
npm start       # Production
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Login → JWT token |
| GET | `/api/projects` | ❌ | List all projects |
| POST | `/api/projects` | ✅ | Create project |
| PUT | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |
| GET | `/api/skills` | ❌ | List skill categories |
| POST | `/api/skills` | ✅ | Create skill category |
| PUT | `/api/skills/:id` | ✅ | Update skill category |
| DELETE | `/api/skills/:id` | ✅ | Delete skill category |
| GET | `/api/experience` | ❌ | List experience |
| POST | `/api/experience` | ✅ | Create experience |
| PUT | `/api/experience/:id` | ✅ | Update experience |
| DELETE | `/api/experience/:id` | ✅ | Delete experience |
| GET | `/api/education` | ❌ | List education |
| POST | `/api/education` | ✅ | Create education |
| PUT | `/api/education/:id` | ✅ | Update education |
| DELETE | `/api/education/:id` | ✅ | Delete education |
| GET | `/api/certifications` | ❌ | List certifications |
| POST | `/api/certifications` | ✅ | Create certification |
| PUT | `/api/certifications/:id` | ✅ | Update certification |
| DELETE | `/api/certifications/:id` | ✅ | Delete certification |
| GET | `/api/content` | ❌ | All content sections |
| GET | `/api/content/:section` | ❌ | Get section (hero/about/contact/social/footer) |
| PUT | `/api/content/:section` | ✅ | Update section |
| GET | `/api/health` | ❌ | Health check |

✅ = Requires `Authorization: Bearer <JWT_TOKEN>` header

---

## Production Deployment

### Option 1: VPS (DigitalOcean, AWS EC2, etc.)
1. SSH into your server
2. Install Docker & Docker Compose
3. Clone the repository
4. Configure `.env` with production values
5. Run `docker-compose up -d --build`
6. Set up reverse proxy (Nginx) + SSL (Let's Encrypt)

### Option 2: Railway / Render
1. Push code to GitHub
2. Connect Railway/Render to the repo
3. Add a MySQL plugin/service
4. Set environment variables
5. Deploy

---

## Folder Structure
```
portfolio-website/
├── server/
│   ├── server.js            # Express entrypoint
│   ├── seed.js              # Admin user seed script
│   ├── config/
│   │   └── db.js            # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   ├── routes/
│   │   ├── auth.js          # Login endpoint
│   │   ├── projects.js      # Projects CRUD
│   │   ├── skills.js        # Skills CRUD
│   │   ├── experience.js    # Experience CRUD
│   │   ├── education.js     # Education CRUD
│   │   ├── certifications.js# Certifications CRUD
│   │   └── content.js       # Content sections
│   └── models/
│       ├── project.js
│       ├── skill.js
│       ├── experience.js
│       ├── education.js
│       ├── certification.js
│       ├── content.js
│       └── user.js
├── public/                  # Static frontend
│   ├── index.html
│   ├── admin.html
│   ├── css/
│   ├── js/
│   └── assets/
├── schema.sql
├── .env / .env.example
├── Dockerfile
├── docker-compose.yml
└── package.json
```
