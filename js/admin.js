/* ==========================================
   ADMIN PANEL — LOGIC
   ==========================================
   localStorage-based content management
   ========================================== */

(function () {
    'use strict';

    /* ---------- Constants ---------- */
    const STORAGE_KEY = 'portfolio_admin_data';
    const AUTH_KEY = 'portfolio_admin_auth';
    const DEFAULT_PASS = 'admin123';

    /* ---------- Default Data (matches the portfolio HTML) ---------- */
    const DEFAULT_DATA = {
        hero: {
            greeting: 'Hello.',
            name: 'Muhammad Zaid',
            title: 'Data, Cloud & DevOps Engineer',
            description: 'I build cloud-ready data systems and automate infrastructure using Linux, Docker, Snowflake, and modern DevOps practices.',
            cta1Text: 'View My Work',
            cta1Link: '#projects',
            cta2Text: 'Contact Me',
            cta2Link: '#contact',
            ticker: 'Linux,AWS,Docker,Snowflake,Python,SQL,Databricks,CI/CD,GitHub Actions,Data Warehousing',
        },
        about: {
            paragraph1: 'I am an aspiring <strong>Data, Cloud & DevOps Engineer</strong> currently enrolled in the Cloud Data Engineering program at SMIT. With a background in Mechanical Engineering and hands-on experience in Linux systems and automation, I am making a focused transition into cloud infrastructure and data engineering.',
            paragraph2: 'My work revolves around building <strong>scalable cloud architectures</strong>, automating workflows with modern DevOps tools, and designing reliable data systems that turn raw information into meaningful insights. I thrive on solving complex technical challenges and continuously pushing the boundaries of what I can build.',
            stats: [
                { icon: '🎓', label: 'Education', value: 'Mechanical Engineering', sub: 'Diploma (2023–2026)' },
                { icon: '☁️', label: 'Program', value: 'Cloud Data Engineering', sub: 'SMIT (2025–2026)' },
                { icon: '📜', label: 'Certified', value: '5+ Certifications', sub: 'Cloud, Data & DevOps' },
            ],
        },
        skills: [
            { name: 'Cloud', icon: '☁️', cssClass: 'cloud', items: 'AWS,Snowflake,Databricks,AWS Lambda,S3,VPC' },
            { name: 'DevOps', icon: '⚙️', cssClass: 'devops', items: 'Docker,GitHub Actions,CI/CD,Linux,Shell Scripting' },
            { name: 'Data Engineering', icon: '📊', cssClass: 'data', items: 'SQL,Data Warehousing,Data Modeling,ETL Pipelines,Data Validation' },
            { name: 'Languages & Tools', icon: '💻', cssClass: 'lang', items: 'Python,HTML / CSS,JavaScript,Git & GitHub,Power BI' },
        ],
        projects: [
            {
                title: 'Serverless Currency ETL Pipeline',
                description: 'Built a fully serverless data pipeline that extracts live currency exchange rates, transforms the data, and loads it into Snowflake for analytics — all orchestrated through AWS Lambda with zero infrastructure overhead.',
                tags: 'AWS Lambda,S3,Snowflake,Python,ETL',
                github: 'https://github.com/muhammad-zaid0',
            },
            {
                title: 'AWS VPC Network Architecture',
                description: 'Designed and deployed a production-grade AWS VPC with public and private subnets, custom route tables, internet gateways, and NAT configurations — establishing a secure, scalable cloud network foundation.',
                tags: 'AWS VPC,Subnets,Route Tables,Internet Gateway',
                github: 'https://github.com/muhammad-zaid0',
            },
            {
                title: 'Data Validation Framework',
                description: 'Developed a Python-based data validation framework that enforces quality checks, schema validation, and structured integrity rules — ensuring clean, reliable data flows across engineering pipelines.',
                tags: 'Python,Data Quality,Validation,Automation',
                github: 'https://github.com/muhammad-zaid0',
            },
        ],
        experience: [
            {
                role: 'Maintenance Mechanic',
                company: 'GTR Tyre · Karachi, Pakistan',
                date: 'Jan 2025 — Mar 2025',
                description: 'Diagnosed and resolved complex mechanical system failures across production-line equipment, applying systematic troubleshooting methodologies. Optimized maintenance workflows that reduced downtime, strengthening my core engineering skills in <strong>problem solving</strong>, <strong>systems thinking</strong>, and <strong>process optimization</strong> — competencies I now bring to cloud infrastructure and DevOps.',
                tags: 'Systems Troubleshooting,Process Optimization,Technical Operations',
            },
        ],
        education: [
            { icon: '🎓', title: 'Government Polytechnic Institute', degree: 'Diploma in Mechanical Engineering', year: '2023 — 2026' },
            { icon: '☁️', title: 'Saylani Mass IT Training (SMIT)', degree: 'Cloud Data Engineering Program', year: '2025 — 2026' },
        ],
        certifications: [
            'Linux for DevOps — Masterclass',
            'Python Essentials 1',
            'Databricks Fundamentals',
            'Introduction to Data Science',
            'Get Started Building with Power BI',
        ],
        contact: {
            heading: "Have a project?\nLet's talk!",
            description: "Interested in working together? Whether it's cloud infrastructure, data engineering, or DevOps automation — I'm always open to exciting collaborations and opportunities.",
            email: 'zaidahmed0317@gmail.com',
            formspree: 'https://formspree.io/f/xplaceholder',
        },
        social: {
            linkedin: 'https://www.linkedin.com/in/muhammadzaid17',
            github: 'https://github.com/muhammad-zaid0',
        },
        footer: {
            name: 'Muhammad Zaid',
            copy: 'Built with ❤️ by Muhammad Zaid © 2025',
        },
    };

    /* ---------- DOM References ---------- */
    const loginOverlay = document.getElementById('loginOverlay');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const adminShell = document.getElementById('adminShell');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarLinks = document.querySelectorAll('.sidebar__link');
    const panelTitle = document.getElementById('panelTitle');
    const saveAllBtn = document.getElementById('saveAllBtn');
    const exportBtn = document.getElementById('exportBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const toast = document.getElementById('toast');

    /* ---------- Data ---------- */
    let data = {};

    /* ================================================
       AUTH
       ================================================ */
    function isLoggedIn() {
        return sessionStorage.getItem(AUTH_KEY) === 'true';
    }

    function login(password) {
        const saved = localStorage.getItem('portfolio_admin_pass') || DEFAULT_PASS;
        if (password === saved) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            return true;
        }
        return false;
    }

    function logout() {
        sessionStorage.removeItem(AUTH_KEY);
        location.reload();
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pw = document.getElementById('loginPassword').value;
        if (login(pw)) {
            showAdmin();
        } else {
            loginError.textContent = 'Incorrect password. Try again.';
        }
    });

    logoutBtn.addEventListener('click', logout);

    function showAdmin() {
        loginOverlay.style.display = 'none';
        adminShell.style.display = 'flex';
        loadData();
        populateAllForms();
    }

    /* ================================================
       DATA — Load / Save / Export
       ================================================ */
    function loadData() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try { data = JSON.parse(raw); } catch (e) { data = JSON.parse(JSON.stringify(DEFAULT_DATA)); }
        } else {
            data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        }
        // Ensure all keys exist (in case of partial saves)
        for (const key in DEFAULT_DATA) {
            if (!(key in data)) data[key] = JSON.parse(JSON.stringify(DEFAULT_DATA[key]));
        }
    }

    function saveData() {
        collectAllForms();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        showToast('Changes saved successfully!', 'success');
    }

    function exportData() {
        collectAllForms();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio-data.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Data exported as JSON.', 'success');
    }

    saveAllBtn.addEventListener('click', saveData);
    exportBtn.addEventListener('click', exportData);

    /* ================================================
       SIDEBAR NAVIGATION
       ================================================ */
    const panelTitles = {
        hero: 'Hero Section',
        about: 'About Me',
        skills: 'Skills & Tech Stack',
        projects: 'Projects',
        experience: 'Work Experience',
        education: 'Education & Certifications',
        contact: 'Contact & Social Links',
    };

    sidebarLinks.forEach((link) => {
        link.addEventListener('click', () => {
            const target = link.dataset.panel;

            // Active link
            sidebarLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');

            // Active panel
            document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
            document.getElementById('panel-' + target).classList.add('active');

            // Title
            panelTitle.textContent = panelTitles[target] || 'Section';

            // Close sidebar on mobile
            sidebar.classList.remove('open');
        });
    });

    /* Mobile sidebar toggle */
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    /* ================================================
       TOAST
       ================================================ */
    let toastTimer;
    function showToast(msg, type) {
        clearTimeout(toastTimer);
        toast.textContent = msg;
        toast.className = 'toast ' + type + ' show';
        toastTimer = setTimeout(() => { toast.className = 'toast'; }, 3000);
    }

    /* ================================================
       POPULATE FORMS — read data → DOM
       ================================================ */
    function populateAllForms() {
        populateHero();
        populateAbout();
        populateSkills();
        populateProjects();
        populateExperience();
        populateEducation();
        populateContact();
    }

    function populateHero() {
        const h = data.hero;
        setVal('heroGreeting', h.greeting);
        setVal('heroName', h.name);
        setVal('heroTitle', h.title);
        setVal('heroDescription', h.description);
        setVal('heroCta1Text', h.cta1Text);
        setVal('heroCta1Link', h.cta1Link);
        setVal('heroCta2Text', h.cta2Text);
        setVal('heroCta2Link', h.cta2Link);
        setVal('heroTicker', h.ticker);
    }

    function populateAbout() {
        setVal('aboutParagraph1', data.about.paragraph1);
        setVal('aboutParagraph2', data.about.paragraph2);
        renderListItems('aboutStatsContainer', data.about.stats, renderStatItem);
    }

    function populateSkills() {
        renderListItems('skillCategoriesContainer', data.skills, renderSkillCatItem);
    }

    function populateProjects() {
        renderListItems('projectsContainer', data.projects, renderProjectItem);
    }

    function populateExperience() {
        renderListItems('experienceContainer', data.experience, renderExpItem);
    }

    function populateEducation() {
        renderListItems('educationContainer', data.education, renderEduItem);
        renderListItems('certsContainer', data.certifications, renderCertItem);
    }

    function populateContact() {
        const c = data.contact;
        setVal('contactHeading', c.heading);
        setVal('contactDescription', c.description);
        setVal('contactEmail', c.email);
        setVal('contactFormspree', c.formspree);
        setVal('socialLinkedin', data.social.linkedin);
        setVal('socialGithub', data.social.github);
        setVal('footerName', data.footer.name);
        setVal('footerCopy', data.footer.copy);
    }

    /* ================================================
       COLLECT FORMS — DOM → data
       ================================================ */
    function collectAllForms() {
        collectHero();
        collectAbout();
        collectSkills();
        collectProjects();
        collectExperience();
        collectEducation();
        collectContact();
    }

    function collectHero() {
        data.hero = {
            greeting: getVal('heroGreeting'),
            name: getVal('heroName'),
            title: getVal('heroTitle'),
            description: getVal('heroDescription'),
            cta1Text: getVal('heroCta1Text'),
            cta1Link: getVal('heroCta1Link'),
            cta2Text: getVal('heroCta2Text'),
            cta2Link: getVal('heroCta2Link'),
            ticker: getVal('heroTicker'),
        };
    }

    function collectAbout() {
        data.about.paragraph1 = getVal('aboutParagraph1');
        data.about.paragraph2 = getVal('aboutParagraph2');
        data.about.stats = collectListItems('aboutStatsContainer', ['icon', 'label', 'value', 'sub']);
    }

    function collectSkills() {
        data.skills = collectListItems('skillCategoriesContainer', ['name', 'icon', 'cssClass', 'items']);
    }

    function collectProjects() {
        data.projects = collectListItems('projectsContainer', ['title', 'description', 'tags', 'github']);
    }

    function collectExperience() {
        data.experience = collectListItems('experienceContainer', ['role', 'company', 'date', 'description', 'tags']);
    }

    function collectEducation() {
        data.education = collectListItems('educationContainer', ['icon', 'title', 'degree', 'year']);
        data.certifications = collectCertItems();
    }

    function collectContact() {
        data.contact = {
            heading: getVal('contactHeading'),
            description: getVal('contactDescription'),
            email: getVal('contactEmail'),
            formspree: getVal('contactFormspree'),
        };
        data.social = {
            linkedin: getVal('socialLinkedin'),
            github: getVal('socialGithub'),
        };
        data.footer = {
            name: getVal('footerName'),
            copy: getVal('footerCopy'),
        };
    }

    /* ================================================
       DYNAMIC LIST ITEM RENDERERS
       ================================================ */

    /* -- Generic renderer -- */
    function renderListItems(containerId, items, renderFn) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        items.forEach((item, i) => {
            container.appendChild(renderFn(item, i));
        });
    }

    /* -- Stat card -- */
    function renderStatItem(item, i) {
        const div = createListItem('Stat #' + (i + 1));
        div.innerHTML += `
      <div class="form-row">
        <div class="input-group">
          <label>Icon (emoji)</label>
          <input type="text" data-field="icon" value="${esc(item.icon)}">
        </div>
        <div class="input-group">
          <label>Label</label>
          <input type="text" data-field="label" value="${esc(item.label)}">
        </div>
      </div>
      <div class="form-row">
        <div class="input-group">
          <label>Value</label>
          <input type="text" data-field="value" value="${esc(item.value)}">
        </div>
        <div class="input-group">
          <label>Sub Text</label>
          <input type="text" data-field="sub" value="${esc(item.sub)}">
        </div>
      </div>`;
        return div;
    }

    /* -- Skill category -- */
    function renderSkillCatItem(item, i) {
        const div = createListItem('Category #' + (i + 1));
        div.innerHTML += `
      <div class="form-row">
        <div class="input-group">
          <label>Category Name</label>
          <input type="text" data-field="name" value="${esc(item.name)}">
        </div>
        <div class="input-group">
          <label>Icon (emoji)</label>
          <input type="text" data-field="icon" value="${esc(item.icon)}">
        </div>
      </div>
      <div class="form-row">
        <div class="input-group">
          <label>CSS Class (cloud/devops/data/lang)</label>
          <input type="text" data-field="cssClass" value="${esc(item.cssClass)}">
        </div>
        <div class="input-group">
          <label>Skills (comma-separated)</label>
          <input type="text" data-field="items" value="${esc(item.items)}">
        </div>
      </div>`;
        return div;
    }

    /* -- Project -- */
    function renderProjectItem(item, i) {
        const div = createListItem('Project #' + (i + 1));
        div.innerHTML += `
      <div class="input-group">
        <label>Title</label>
        <input type="text" data-field="title" value="${esc(item.title)}">
      </div>
      <div class="input-group">
        <label>Description</label>
        <textarea data-field="description" rows="3">${esc(item.description)}</textarea>
      </div>
      <div class="form-row">
        <div class="input-group">
          <label>Tags (comma-separated)</label>
          <input type="text" data-field="tags" value="${esc(item.tags)}">
        </div>
        <div class="input-group">
          <label>GitHub URL</label>
          <input type="url" data-field="github" value="${esc(item.github)}">
        </div>
      </div>`;
        return div;
    }

    /* -- Experience -- */
    function renderExpItem(item, i) {
        const div = createListItem('Experience #' + (i + 1));
        div.innerHTML += `
      <div class="form-row">
        <div class="input-group">
          <label>Role / Job Title</label>
          <input type="text" data-field="role" value="${esc(item.role)}">
        </div>
        <div class="input-group">
          <label>Date Range</label>
          <input type="text" data-field="date" value="${esc(item.date)}">
        </div>
      </div>
      <div class="input-group">
        <label>Company · Location</label>
        <input type="text" data-field="company" value="${esc(item.company)}">
      </div>
      <div class="input-group">
        <label>Description (HTML allowed)</label>
        <textarea data-field="description" rows="4">${esc(item.description)}</textarea>
      </div>
      <div class="input-group">
        <label>Tags (comma-separated)</label>
        <input type="text" data-field="tags" value="${esc(item.tags)}">
      </div>`;
        return div;
    }

    /* -- Education -- */
    function renderEduItem(item, i) {
        const div = createListItem('Education #' + (i + 1));
        div.innerHTML += `
      <div class="form-row">
        <div class="input-group">
          <label>Icon (emoji)</label>
          <input type="text" data-field="icon" value="${esc(item.icon)}">
        </div>
        <div class="input-group">
          <label>Institution</label>
          <input type="text" data-field="title" value="${esc(item.title)}">
        </div>
      </div>
      <div class="form-row">
        <div class="input-group">
          <label>Degree / Program</label>
          <input type="text" data-field="degree" value="${esc(item.degree)}">
        </div>
        <div class="input-group">
          <label>Year Range</label>
          <input type="text" data-field="year" value="${esc(item.year)}">
        </div>
      </div>`;
        return div;
    }

    /* -- Certification (simple string) -- */
    function renderCertItem(item, i) {
        const div = createListItem('Cert #' + (i + 1));
        div.innerHTML += `
      <div class="input-group">
        <label>Certification Name</label>
        <input type="text" data-field="certName" value="${esc(item)}">
      </div>`;
        return div;
    }

    /* -- Generic list item wrapper with delete button -- */
    function createListItem(label) {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
      <div class="list-item__header">
        <span class="list-item__number">${label}</span>
        <button type="button" class="btn btn--danger remove-item-btn">Remove</button>
      </div>`;
        div.querySelector('.remove-item-btn').addEventListener('click', () => {
            div.remove();
        });
        return div;
    }

    /* ================================================
       COLLECT LIST ITEMS — DOM → array
       ================================================ */
    function collectListItems(containerId, fields) {
        const container = document.getElementById(containerId);
        const items = [];
        container.querySelectorAll('.list-item').forEach((li) => {
            const obj = {};
            fields.forEach((f) => {
                const el = li.querySelector(`[data-field="${f}"]`);
                obj[f] = el ? el.value.trim() : '';
            });
            items.push(obj);
        });
        return items;
    }

    function collectCertItems() {
        const container = document.getElementById('certsContainer');
        const certs = [];
        container.querySelectorAll('.list-item').forEach((li) => {
            const el = li.querySelector('[data-field="certName"]');
            if (el && el.value.trim()) certs.push(el.value.trim());
        });
        return certs;
    }

    /* ================================================
       ADD BUTTONS
       ================================================ */
    document.getElementById('addStatBtn').addEventListener('click', () => {
        const container = document.getElementById('aboutStatsContainer');
        const i = container.children.length;
        container.appendChild(renderStatItem({ icon: '', label: '', value: '', sub: '' }, i));
    });

    document.getElementById('addSkillCatBtn').addEventListener('click', () => {
        const container = document.getElementById('skillCategoriesContainer');
        const i = container.children.length;
        container.appendChild(renderSkillCatItem({ name: '', icon: '', cssClass: '', items: '' }, i));
    });

    document.getElementById('addProjectBtn').addEventListener('click', () => {
        const container = document.getElementById('projectsContainer');
        const i = container.children.length;
        container.appendChild(renderProjectItem({ title: '', description: '', tags: '', github: '' }, i));
    });

    document.getElementById('addExpBtn').addEventListener('click', () => {
        const container = document.getElementById('experienceContainer');
        const i = container.children.length;
        container.appendChild(renderExpItem({ role: '', company: '', date: '', description: '', tags: '' }, i));
    });

    document.getElementById('addEduBtn').addEventListener('click', () => {
        const container = document.getElementById('educationContainer');
        const i = container.children.length;
        container.appendChild(renderEduItem({ icon: '', title: '', degree: '', year: '' }, i));
    });

    document.getElementById('addCertBtn').addEventListener('click', () => {
        const container = document.getElementById('certsContainer');
        const i = container.children.length;
        container.appendChild(renderCertItem('', i));
    });

    /* ================================================
       UTILS
       ================================================ */
    function setVal(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value || '';
    }

    function getVal(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function esc(str) {
        if (typeof str !== 'string') return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* ================================================
       INIT
       ================================================ */
    if (isLoggedIn()) {
        showAdmin();
    }

})();
