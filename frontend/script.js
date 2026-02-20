/* ============================================================
   RUQFA MARKETING — script.js
   ============================================================ */

(function () {
  'use strict';

  // Contact form API: Netlify function (use '' + path when on Netlify or with netlify dev)
  const CONTACT_API = '/.netlify/functions/contact';

  /* ── Navbar scroll ────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  /* ── Mobile hamburger ─────────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
  });

  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle?.classList.remove('open');
      navLinks.classList.remove('mobile-open');
    });
  });

  /* ── Smooth scroll ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || this.hasAttribute('data-open-modal')) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Scroll-reveal ────────────────────────────────────────── */
  const revealObs = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── Portfolio Filter Tabs ────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-tab');
  const workCards = document.querySelectorAll('#workGrid .work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      workCards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ── Contact Modal ────────────────────────────────────────── */
  const modal = document.getElementById('contactModal');
  const closeBtn = document.getElementById('modalClose');
  const openBtns = document.querySelectorAll('[data-open-modal]');
  const contactForm = document.getElementById('contactForm');

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => contactForm?.querySelector('.form-input')?.focus(), 180);
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); openModal(); });
  });
  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ── Form Validation ──────────────────────────────────────── */
  function setError(groupId, msg) {
    const g = document.getElementById(groupId);
    if (!g) return;
    g.classList.add('has-error');
    const err = g.querySelector('.form-error');
    if (err) err.textContent = msg;
    g.querySelector('.form-input')?.classList.add('error');
  }

  function clearError(groupId) {
    const g = document.getElementById(groupId);
    if (!g) return;
    g.classList.remove('has-error');
    g.querySelector('.form-input')?.classList.remove('error');
  }

  function validate(data) {
    let ok = true;
    ['groupName', 'groupMobile', 'groupEmail', 'groupProblem'].forEach(clearError);

    if (!data.name.trim()) { setError('groupName', 'Name is required.'); ok = false; }

    if (!data.mobile.trim()) { setError('groupMobile', 'Mobile number is required.'); ok = false; }
    else if (!/^[\d\s+\-()]{7,15}$/.test(data.mobile.trim())) { setError('groupMobile', 'Enter a valid phone number.'); ok = false; }

    if (!data.email.trim()) { setError('groupEmail', 'Email is required.'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) { setError('groupEmail', 'Enter a valid email address.'); ok = false; }

    if (!data.problem.trim()) { setError('groupProblem', 'Please describe your podcast.'); ok = false; }
    else if (data.problem.trim().length < 10) { setError('groupProblem', 'Please provide more detail (min 10 chars).'); ok = false; }

    return ok;
  }

  /* ── Form Submit ──────────────────────────────────────────── */
  contactForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      name: document.getElementById('fieldName').value,
      mobile: document.getElementById('fieldMobile').value,
      email: document.getElementById('fieldEmail').value,
      problem: document.getElementById('fieldProblem').value,
    };
    if (!validate(data)) return;

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.classList.add('loading');

    try {
      const res = await fetch(CONTACT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (res.ok && json.success !== false) {
        showToast('success', '✓', 'Message sent! We\'ll be in touch within 24 hours.');
        contactForm.reset();
        closeModal();
      } else {
        showToast('error', '!', json.message || json.detail || 'Something went wrong.');
      }
    } catch {
      showToast('error', '!', 'Could not connect. Please try again later.');
    } finally {
      btn.disabled = false;
      btn.classList.remove('loading');
    }
  });

  // Clear errors on input
  contactForm?.querySelectorAll('.form-input').forEach(inp => {
    inp.addEventListener('input', function () {
      const g = this.closest('.form-group');
      if (g) { g.classList.remove('has-error'); this.classList.remove('error'); }
    });
  });

  /* ── Toast ────────────────────────────────────────────────── */
  const toastContainer = document.getElementById('toast-container');

  function showToast(type, icon, message) {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(el);
    setTimeout(() => {
      el.classList.add('exit');
      el.addEventListener('animationend', () => el.remove());
    }, 4000);
  }

})();
