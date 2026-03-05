/* ==========================================
   ADMIN PANEL — JWT Auth + REST API CRUD
   ==========================================
   Connects to Node.js + Express backend.
   All data persisted in MySQL via REST API.
   ========================================== */

(function () {
    'use strict';

    /* ---------- Constants ---------- */
    const API = '/api';
    const TOKEN_KEY = 'portfolio_admin_token';

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
       AUTH — JWT-based
       ================================================ */
    function getToken() {
        return sessionStorage.getItem(TOKEN_KEY);
    }

    function setToken(token) {
        sessionStorage.setItem(TOKEN_KEY, token);
    }

    function clearToken() {
        sessionStorage.removeItem(TOKEN_KEY);
    }

    function isLoggedIn() {
        return !!getToken();
    }

    function authHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken(),
        };
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            loginError.textContent = 'Please enter both email and password.';
            return;
        }

        try {
            const res = await fetch(`${API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await res.json();

            if (!res.ok) {
                loginError.textContent = result.error || 'Login failed.';
                return;
            }

            setToken(result.token);
            showAdmin();
        } catch (err) {
            loginError.textContent = 'Network error. Please try again.';
            console.error('Login error:', err);
        }
    });

    logoutBtn.addEventListener('click', () => {
        clearToken();
        location.reload();
    });

    function showAdmin() {
        loginOverlay.style.display = 'none';
        adminShell.style.display = 'flex';
        loadDataFromAPI();
    }

    /* ================================================
       DATA — Load from API / Save to API
       ================================================ */
    async function loadDataFromAPI() {
        try {
            const [content, projects, skills, experience, education, certifications] = await Promise.all([
                fetchJSON(`${API}/content`),
                fetchJSON(`${API}/projects`),
                fetchJSON(`${API}/skills`),
                fetchJSON(`${API}/experience`),
                fetchJSON(`${API}/education`),
                fetchJSON(`${API}/certifications`),
            ]);

            data = {
                hero: content.hero || {},
                about: content.about || {},
                skills: skills || [],
                projects: projects || [],
                experience: experience || [],
                education: education || [],
                certifications: certifications || [],
                contact: content.contact || {},
                social: content.social || {},
                footer: content.footer || {},
            };

            populateAllForms();
        } catch (err) {
            console.error('Failed to load data:', err);
            showToast('Failed to load data from server.', 'error');
        }
    }

    async function fetchJSON(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    }

    async function saveData() {
        collectAllForms();
        saveAllBtn.disabled = true;
        saveAllBtn.textContent = 'Saving...';

        try {
            // Save content sections (hero, about, contact, social, footer)
            const contentSections = ['hero', 'about', 'contact', 'social', 'footer'];
            const contentPromises = contentSections.map((section) =>
                fetch(`${API}/content/${section}`, {
                    method: 'PUT',
                    headers: authHeaders(),
                    body: JSON.stringify(data[section]),
                })
            );

            // Save list-based entities: delete all then recreate
            const listEntities = [
                { key: 'projects', endpoint: '/projects', fields: ['title', 'description', 'tags', 'github_url', 'sort_order'] },
                { key: 'skills', endpoint: '/skills', fields: ['name', 'icon', 'css_class', 'items', 'sort_order'] },
                { key: 'experience', endpoint: '/experience', fields: ['role', 'company', 'date_range', 'description', 'tags', 'sort_order'] },
                { key: 'education', endpoint: '/education', fields: ['icon', 'title', 'degree', 'year_range', 'sort_order'] },
                { key: 'certifications', endpoint: '/certifications', fields: ['name', 'sort_order'] },
            ];

            // For each entity, first get existing items to delete, then create new ones
            const listPromises = listEntities.map(async (entity) => {
                // Get current items
                const existing = await fetchJSON(`${API}${entity.endpoint}`);

                // Delete all existing
                for (const item of existing) {
                    await fetch(`${API}${entity.endpoint}/${item.id}`, {
                        method: 'DELETE',
                        headers: authHeaders(),
                    });
                }

                // Create new items
                const items = data[entity.key] || [];
                for (let i = 0; i < items.length; i++) {
                    const item = { ...items[i], sort_order: i + 1 };
                    await fetch(`${API}${entity.endpoint}`, {
                        method: 'POST',
                        headers: authHeaders(),
                        body: JSON.stringify(item),
                    });
                }
            });

            await Promise.all([...contentPromises, ...listPromises]);

            showToast('All changes saved successfully!', 'success');
        } catch (err) {
            console.error('Save error:', err);
            showToast('Failed to save. Check console for details.', 'error');
        } finally {
            saveAllBtn.disabled = false;
            saveAllBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/>
          <polyline points="7 3 7 8 15 8"/>
        </svg>
        Save Changes`;
        }
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
            sidebarLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
            document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
            document.getElementById('panel-' + target).classList.add('active');
            panelTitle.textContent = panelTitles[target] || 'Section';
            sidebar.classList.remove('open');
        });
    });

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
       POPULATE FORMS — data → DOM
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
        renderListItems('aboutStatsContainer', data.about.stats || [], renderStatItem);
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
        data.skills = collectListItems('skillCategoriesContainer', ['name', 'icon', 'css_class', 'items']);
    }

    function collectProjects() {
        data.projects = collectListItems('projectsContainer', ['title', 'description', 'tags', 'github_url']);
    }

    function collectExperience() {
        data.experience = collectListItems('experienceContainer', ['role', 'company', 'date_range', 'description', 'tags']);
    }

    function collectEducation() {
        data.education = collectListItems('educationContainer', ['icon', 'title', 'degree', 'year_range']);
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
    function renderListItems(containerId, items, renderFn) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        (items || []).forEach((item, i) => {
            container.appendChild(renderFn(item, i));
        });
    }

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
          <input type="text" data-field="css_class" value="${esc(item.css_class)}">
        </div>
        <div class="input-group">
          <label>Skills (comma-separated)</label>
          <input type="text" data-field="items" value="${esc(item.items)}">
        </div>
      </div>`;
        return div;
    }

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
          <input type="url" data-field="github_url" value="${esc(item.github_url)}">
        </div>
      </div>`;
        return div;
    }

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
          <input type="text" data-field="date_range" value="${esc(item.date_range)}">
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
          <input type="text" data-field="year_range" value="${esc(item.year_range)}">
        </div>
      </div>`;
        return div;
    }

    function renderCertItem(item, i) {
        const div = createListItem('Cert #' + (i + 1));
        div.innerHTML += `
      <div class="input-group">
        <label>Certification Name</label>
        <input type="text" data-field="certName" value="${esc(typeof item === 'string' ? item : item.name)}">
      </div>`;
        return div;
    }

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
            if (el && el.value.trim()) {
                certs.push({ name: el.value.trim() });
            }
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
        container.appendChild(renderSkillCatItem({ name: '', icon: '', css_class: '', items: '' }, i));
    });

    document.getElementById('addProjectBtn').addEventListener('click', () => {
        const container = document.getElementById('projectsContainer');
        const i = container.children.length;
        container.appendChild(renderProjectItem({ title: '', description: '', tags: '', github_url: '' }, i));
    });

    document.getElementById('addExpBtn').addEventListener('click', () => {
        const container = document.getElementById('experienceContainer');
        const i = container.children.length;
        container.appendChild(renderExpItem({ role: '', company: '', date_range: '', description: '', tags: '' }, i));
    });

    document.getElementById('addEduBtn').addEventListener('click', () => {
        const container = document.getElementById('educationContainer');
        const i = container.children.length;
        container.appendChild(renderEduItem({ icon: '', title: '', degree: '', year_range: '' }, i));
    });

    document.getElementById('addCertBtn').addEventListener('click', () => {
        const container = document.getElementById('certsContainer');
        const i = container.children.length;
        container.appendChild(renderCertItem({ name: '' }, i));
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
