/* ==========================================
   MUHAMMAD ZAID — PORTFOLIO SCRIPTS
   ==========================================
   Fetches data from REST API and renders
   dynamic content into the portfolio DOM.
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ---------- Element References ---------- */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollBar = document.getElementById('scrollProgress');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const sections = document.querySelectorAll('section[id]');

    /* ---------- API Base URL ---------- */
    const API = '/api';

    /* ================================================
       0. LOAD DATA FROM REST API
       ================================================ */
    async function loadPortfolioData() {
        try {
            // Fetch all data in parallel
            const [content, projects, skills, experience, education, certifications] = await Promise.all([
                fetchJSON(`${API}/content`),
                fetchJSON(`${API}/projects`),
                fetchJSON(`${API}/skills`),
                fetchJSON(`${API}/experience`),
                fetchJSON(`${API}/education`),
                fetchJSON(`${API}/certifications`),
            ]);

            // Render each section
            if (content.hero) renderHero(content.hero);
            if (content.about) renderAbout(content.about);
            if (skills && skills.length) renderSkills(skills);
            if (projects && projects.length) renderProjects(projects);
            if (experience && experience.length) renderExperience(experience);
            if (education && education.length) renderEducation(education);
            if (certifications && certifications.length) renderCertifications(certifications);
            if (content.contact) renderContact(content.contact);
            if (content.social) renderSocial(content.social);
            if (content.footer) renderFooter(content.footer);

            // Re-observe dynamically added .reveal elements
            setTimeout(() => {
                document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
                    revealObserver.observe(el);
                });
            }, 100);

        } catch (err) {
            console.warn('Failed to load portfolio data from API, using static HTML fallback:', err);
        }
    }

    async function fetchJSON(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
        return res.json();
    }

    /* ---------- Renderers ---------- */

    function setText(sel, val) {
        const el = document.querySelector(sel);
        if (el && val !== undefined) el.textContent = val;
    }

    function setHTML(sel, val) {
        const el = document.querySelector(sel);
        if (el && val !== undefined) el.innerHTML = val;
    }

    function renderHero(h) {
        setText('.hero__greeting', h.greeting);
        if (h.name) {
            const nameEl = document.querySelector('.hero__name');
            if (nameEl) nameEl.innerHTML = "I'm <span class='text-gradient'>" + h.name + '</span>';
        }
        setText('.hero__title', h.title);
        setText('.hero__description', h.description);

        const cta1 = document.querySelector('.hero__cta .btn--primary');
        const cta2 = document.querySelector('.hero__cta .btn--outline');
        if (cta1 && h.cta1Text) { cta1.querySelector('span').textContent = h.cta1Text; cta1.href = h.cta1Link || '#'; }
        if (cta2 && h.cta2Text) { cta2.querySelector('span').textContent = h.cta2Text; cta2.href = h.cta2Link || '#'; }

        if (h.ticker) {
            const track = document.querySelector('.ticker__track');
            if (track) {
                const items = h.ticker.split(',').map((t) => t.trim()).filter(Boolean);
                track.innerHTML = [...items, ...items].map((t) => '<span class="ticker__item">' + t + '</span>').join('');
            }
        }
    }

    function renderAbout(a) {
        const aboutPs = document.querySelectorAll('.about__text p');
        if (aboutPs[0] && a.paragraph1) aboutPs[0].innerHTML = a.paragraph1;
        if (aboutPs[1] && a.paragraph2) aboutPs[1].innerHTML = a.paragraph2;

        if (a.stats && a.stats.length) {
            const statsBox = document.querySelector('.about__stats');
            if (statsBox) {
                statsBox.innerHTML = a.stats.map((s) => `
          <div class="stat-card">
            <div class="stat-card__icon">${s.icon}</div>
            <div class="stat-card__info">
              <span class="stat-card__label">${s.label}</span>
              <span class="stat-card__value">${s.value}</span>
              <span class="stat-card__sub">${s.sub}</span>
            </div>
          </div>`).join('');
            }
        }
    }

    function renderSkills(skillCategories) {
        const grid = document.querySelector('.skills__grid');
        if (!grid) return;
        grid.innerHTML = skillCategories.map((cat) => `
      <div class="skill-category reveal">
        <h3 class="skill-category__title">
          <span class="skill-category__icon">${cat.icon}</span> ${cat.name}
        </h3>
        <div class="skill-category__pills">
          ${cat.items.split(',').map((s) => s.trim()).filter(Boolean).map((s) =>
            '<span class="skill-pill skill-pill--' + cat.css_class + '">' + s + '</span>'
        ).join('')}
        </div>
      </div>`).join('');
    }

    function renderProjects(projects) {
        const pGrid = document.querySelector('.projects__grid');
        if (!pGrid) return;
        pGrid.innerHTML = projects.map((p) => `
      <article class="project-card reveal">
        <div class="project-card__header">
          <svg class="project-card__icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <a href="${p.github_url}" target="_blank" rel="noopener noreferrer" class="project-card__link" aria-label="View on GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__desc">${p.description}</p>
        <div class="project-card__tags">
          ${p.tags.split(',').map((t) => t.trim()).filter(Boolean).map((t) => '<span class="tag">' + t + '</span>').join('')}
        </div>
      </article>`).join('');
    }

    function renderExperience(items) {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;
        timeline.innerHTML = items.map((e) => `
      <div class="timeline__item reveal">
        <div class="timeline__dot"></div>
        <div class="timeline__card">
          <div class="timeline__header">
            <h3 class="timeline__role">${e.role}</h3>
            <span class="timeline__date">${e.date_range}</span>
          </div>
          <h4 class="timeline__company">${e.company}</h4>
          <p class="timeline__desc">${e.description}</p>
          <div class="timeline__tags">
            ${e.tags.split(',').map((t) => t.trim()).filter(Boolean).map((t) => '<span class="tag">' + t + '</span>').join('')}
          </div>
        </div>
      </div>`).join('');
    }

    function renderEducation(items) {
        const eduGrid = document.querySelector('.education__grid');
        if (!eduGrid) return;
        eduGrid.innerHTML = items.map((e) => `
      <div class="edu-card reveal">
        <div class="edu-card__icon">${e.icon}</div>
        <h3 class="edu-card__title">${e.title}</h3>
        <p class="edu-card__degree">${e.degree}</p>
        <span class="edu-card__year">${e.year_range}</span>
      </div>`).join('');
    }

    function renderCertifications(certs) {
        const certsGrid = document.querySelector('.certs__grid');
        if (!certsGrid) return;
        certsGrid.innerHTML = certs.map((c) => `
      <div class="cert-card reveal">
        <div class="cert-card__badge">📜</div>
        <p class="cert-card__title">${c.name}</p>
      </div>`).join('');
    }

    function renderContact(c) {
        if (c.heading) {
            const h = document.querySelector('.contact__cta-heading');
            if (h) h.innerHTML = c.heading.replace(/\n/g, '<br>');
        }
        setText('.contact__cta-desc', c.description);
        if (c.email) {
            const mailBtn = document.querySelector('.contact__text .btn--primary');
            if (mailBtn) mailBtn.href = 'mailto:' + c.email;
        }
        if (c.formspree && contactForm) {
            contactForm.action = c.formspree;
        }
    }

    function renderSocial(s) {
        const footerLinks = document.querySelectorAll('.footer__socials a');
        footerLinks.forEach((a) => {
            const label = a.getAttribute('aria-label') || '';
            if (label.includes('LinkedIn') && s.linkedin) a.href = s.linkedin;
            if (label.includes('GitHub') && s.github) a.href = s.github;
        });
    }

    function renderFooter(f) {
        setText('.footer__name', f.name);
        setHTML('.footer__copy', f.copy);
    }

    // Start loading data
    loadPortfolioData();

    /* ================================================
       1. SCROLL PROGRESS BAR
       ================================================ */
    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollBar.style.width = scrollPercent + '%';
    }

    /* ================================================
       2. STICKY NAVBAR — add .scrolled class
       ================================================ */
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    /* ================================================
       3. ACTIVE NAVIGATION LINK HIGHLIGHTING
       ================================================ */
    function updateActiveLink() {
        const scrollPos = window.scrollY + 120;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* ================================================
       4. SMOOTH SCROLL — click handlers for nav links
       ================================================ */
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                const offsetTop = targetEl.offsetTop - 72;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }

            closeMobileMenu();
        });
    });

    /* ================================================
       5. MOBILE HAMBURGER MENU
       ================================================ */
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    function closeMobileMenu() {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            closeMobileMenu();
            navToggle.focus();
        }
    });

    /* ================================================
       6. SCROLL REVEAL — IntersectionObserver
       ================================================ */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    /* ================================================
       7. CONTACT FORM — AJAX with Formspree fallback
       ================================================ */
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('formSubmit');
            const formData = new FormData(contactForm);

            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const message = formData.get('message')?.trim();

            if (!name || !email || !message) {
                showFormStatus('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormStatus('Please enter a valid email address.', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Sending...';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' },
                });

                if (response.ok) {
                    showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    mailtoFallback(name, email, message);
                }
            } catch {
                mailtoFallback(name, email, message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'Submit';
            }
        });
    }

    function showFormStatus(msg, type) {
        formStatus.textContent = msg;
        formStatus.className = 'form-status ' + type;
        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
        }, 5000);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function mailtoFallback(name, email, message) {
        const subject = encodeURIComponent('Portfolio Contact from ' + name);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:zaidahmed0317@gmail.com?subject=${subject}&body=${body}`;
        showFormStatus('Opening your email client as fallback...', 'success');
    }

    /* ================================================
       8. SCROLL EVENT HANDLER — throttled
       ================================================ */
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollProgress();
                handleNavbarScroll();
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    updateScrollProgress();
    handleNavbarScroll();
    updateActiveLink();
});
