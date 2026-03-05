-- ==========================================
-- Muhammad Zaid Portfolio — MySQL Schema
-- ==========================================

CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- ========== PROJECTS ==========
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tags VARCHAR(500) DEFAULT '',
  github_url VARCHAR(500) DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== SKILL CATEGORIES ==========
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) DEFAULT '',
  css_class VARCHAR(50) DEFAULT '',
  items TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== EXPERIENCE ==========
CREATE TABLE IF NOT EXISTS experience (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role VARCHAR(255) NOT NULL,
  company VARCHAR(255) DEFAULT '',
  date_range VARCHAR(100) DEFAULT '',
  description TEXT,
  tags VARCHAR(500) DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== EDUCATION ==========
CREATE TABLE IF NOT EXISTS education (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(50) DEFAULT '',
  title VARCHAR(255) NOT NULL,
  degree VARCHAR(255) DEFAULT '',
  year_range VARCHAR(100) DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== CERTIFICATIONS ==========
CREATE TABLE IF NOT EXISTS certifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== CONTENT (JSON key-value) ==========
CREATE TABLE IF NOT EXISTS content (
  section_key VARCHAR(50) PRIMARY KEY,
  data JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== ADMIN USERS ==========
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========== SEED DEFAULT CONTENT ==========
INSERT INTO content (section_key, data) VALUES
  ('hero', JSON_OBJECT(
    'greeting', 'Hello.',
    'name', 'Muhammad Zaid',
    'title', 'Data, Cloud & DevOps Engineer',
    'description', 'I build cloud-ready data systems and automate infrastructure using Linux, Docker, Snowflake, and modern DevOps practices.',
    'cta1Text', 'View My Work',
    'cta1Link', '#projects',
    'cta2Text', 'Contact Me',
    'cta2Link', '#contact',
    'ticker', 'Linux,AWS,Docker,Snowflake,Python,SQL,Databricks,CI/CD,GitHub Actions,Data Warehousing'
  )),
  ('about', JSON_OBJECT(
    'paragraph1', 'I am an aspiring <strong>Data, Cloud & DevOps Engineer</strong> currently enrolled in the Cloud Data Engineering program at SMIT. With a background in Mechanical Engineering and hands-on experience in Linux systems and automation, I am making a focused transition into cloud infrastructure and data engineering.',
    'paragraph2', 'My work revolves around building <strong>scalable cloud architectures</strong>, automating workflows with modern DevOps tools, and designing reliable data systems that turn raw information into meaningful insights. I thrive on solving complex technical challenges and continuously pushing the boundaries of what I can build.',
    'stats', JSON_ARRAY(
      JSON_OBJECT('icon', '🎓', 'label', 'Education', 'value', 'Mechanical Engineering', 'sub', 'Diploma (2023–2026)'),
      JSON_OBJECT('icon', '☁️', 'label', 'Program', 'value', 'Cloud Data Engineering', 'sub', 'SMIT (2025–2026)'),
      JSON_OBJECT('icon', '📜', 'label', 'Certified', 'value', '5+ Certifications', 'sub', 'Cloud, Data & DevOps')
    )
  )),
  ('contact', JSON_OBJECT(
    'heading', 'Have a project?\nLet''s talk!',
    'description', 'Interested in working together? Whether it''s cloud infrastructure, data engineering, or DevOps automation — I''m always open to exciting collaborations and opportunities.',
    'email', 'zaidahmed0317@gmail.com',
    'formspree', 'https://formspree.io/f/xplaceholder'
  )),
  ('social', JSON_OBJECT(
    'linkedin', 'https://www.linkedin.com/in/muhammadzaid17',
    'github', 'https://github.com/muhammad-zaid0'
  )),
  ('footer', JSON_OBJECT(
    'name', 'Muhammad Zaid',
    'copy', 'Built with ❤️ by Muhammad Zaid © 2025'
  ))
ON DUPLICATE KEY UPDATE data = VALUES(data);

-- Seed default projects
INSERT INTO projects (title, description, tags, github_url, sort_order) VALUES
  ('Serverless Currency ETL Pipeline', 'Built a fully serverless data pipeline that extracts live currency exchange rates, transforms the data, and loads it into Snowflake for analytics — all orchestrated through AWS Lambda with zero infrastructure overhead.', 'AWS Lambda,S3,Snowflake,Python,ETL', 'https://github.com/muhammad-zaid0', 1),
  ('AWS VPC Network Architecture', 'Designed and deployed a production-grade AWS VPC with public and private subnets, custom route tables, internet gateways, and NAT configurations — establishing a secure, scalable cloud network foundation.', 'AWS VPC,Subnets,Route Tables,Internet Gateway', 'https://github.com/muhammad-zaid0', 2),
  ('Data Validation Framework', 'Developed a Python-based data validation framework that enforces quality checks, schema validation, and structured integrity rules — ensuring clean, reliable data flows across engineering pipelines.', 'Python,Data Quality,Validation,Automation', 'https://github.com/muhammad-zaid0', 3);

-- Seed default skills
INSERT INTO skills (name, icon, css_class, items, sort_order) VALUES
  ('Cloud', '☁️', 'cloud', 'AWS,Snowflake,Databricks,AWS Lambda,S3,VPC', 1),
  ('DevOps', '⚙️', 'devops', 'Docker,GitHub Actions,CI/CD,Linux,Shell Scripting', 2),
  ('Data Engineering', '📊', 'data', 'SQL,Data Warehousing,Data Modeling,ETL Pipelines,Data Validation', 3),
  ('Languages & Tools', '💻', 'lang', 'Python,HTML / CSS,JavaScript,Git & GitHub,Power BI', 4);

-- Seed default experience
INSERT INTO experience (role, company, date_range, description, tags, sort_order) VALUES
  ('Maintenance Mechanic', 'GTR Tyre · Karachi, Pakistan', 'Jan 2025 — Mar 2025', 'Diagnosed and resolved complex mechanical system failures across production-line equipment, applying systematic troubleshooting methodologies. Optimized maintenance workflows that reduced downtime, strengthening my core engineering skills in <strong>problem solving</strong>, <strong>systems thinking</strong>, and <strong>process optimization</strong> — competencies I now bring to cloud infrastructure and DevOps.', 'Systems Troubleshooting,Process Optimization,Technical Operations', 1);

-- Seed default education
INSERT INTO education (icon, title, degree, year_range, sort_order) VALUES
  ('🎓', 'Government Polytechnic Institute', 'Diploma in Mechanical Engineering', '2023 — 2026', 1),
  ('☁️', 'Saylani Mass IT Training (SMIT)', 'Cloud Data Engineering Program', '2025 — 2026', 2);

-- Seed default certifications
INSERT INTO certifications (name, sort_order) VALUES
  ('Linux for DevOps — Masterclass', 1),
  ('Python Essentials 1', 2),
  ('Databricks Fundamentals', 3),
  ('Introduction to Data Science', 4),
  ('Get Started Building with Power BI', 5);
