/* ============================================================
   9's Cafe — Landing Page Interactions
   Vanilla JS, no dependencies
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. ELEMENT REFERENCES
     ---------------------------------------------------------- */
  const root       = document.documentElement;
  const header     = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks   = document.getElementById('navLinks');
  const navAnchors = document.querySelectorAll('.nav-link');
  const backToTop  = document.getElementById('backToTop');
  const toast      = document.getElementById('toast');
  const toastMsg   = document.getElementById('toastMessage');
  const subButtons = document.querySelectorAll('[data-subscribe]');
  const themeBtn   = document.getElementById('themeToggle');

  const popupOverlay = document.getElementById('popupOverlay');
  const popupClose   = document.getElementById('popupClose');
  const popupSkip    = document.getElementById('popupSkip');
  const popupForm    = document.getElementById('popupForm');
  const popupEmail   = document.getElementById('popupEmail');
  const popupError   = document.getElementById('popupError');

  const contactForm  = document.getElementById('contactForm');

  /* ==========================================================
     A. THEME (DARK / LIGHT MODE)
     ========================================================== */
  const THEME_KEY = '9sc-theme';

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    applyTheme('dark');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ==========================================================
     B. MOBILE MENU
     ========================================================== */
  function closeMenu() {
    navLinks.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (!navLinks.classList.contains('is-open')) return;
      if (navLinks.contains(e.target) || menuToggle.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ==========================================================
     C. SCROLL: HEADER SHADOW + BACK TO TOP
     ========================================================== */
  function handleScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 10);
    if (backToTop) backToTop.classList.toggle('is-visible', y > 500);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================
     D. SCROLL SPY
     ========================================================== */
  const sections = Array.prototype.slice.call(
    document.querySelectorAll('section[id]')
  );

  function setActiveLink(id) {
    navAnchors.forEach(function (link) {
      const target = link.getAttribute('href');
      link.classList.toggle('is-active', target === '#' + id);
    });
  }

  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ==========================================================
     E. SCROLL REVEAL
     ========================================================== */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ==========================================================
     F. TOAST
     ========================================================== */
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add('is-visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  /* ==========================================================
     G. SUBSCRIBE BUTTONS
     ========================================================== */
  subButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      showToast('You\u2019re in! Check your inbox for the free taster. ☕');
    });
  });

  /* ==========================================================
     H. FAQ ACCORDION
     ========================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!button || !answer) return;

    button.addEventListener('click', function () {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach(function (other) {
        if (other === item) return;
        other.classList.remove('is-open');
        const btn = other.querySelector('.faq-question');
        const ans = other.querySelector('.faq-answer');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        if (ans) ans.style.maxHeight = null;
      });

      item.classList.toggle('is-open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));

      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = null;
      }
    });
  });

  window.addEventListener('resize', function () {
    const open = document.querySelector('.faq-item.is-open .faq-answer');
    if (open) open.style.maxHeight = open.scrollHeight + 'px';
  });

  /* ==========================================================
     I. NEWSLETTER POPUP
     ========================================================== */
  const POPUP_KEY = '9sc-popup-seen';
  const POPUP_DELAY = 5000;

  function openPopup() {
    if (!popupOverlay) return;
    popupOverlay.classList.add('is-visible');
    popupOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(function () {
      if (popupEmail) popupEmail.focus();
    }, 320);
  }

  function closePopup() {
    if (!popupOverlay) return;
    popupOverlay.classList.remove('is-visible');
    popupOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    localStorage.setItem(POPUP_KEY, '1');
  }

  if (popupOverlay && !localStorage.getItem(POPUP_KEY)) {
    setTimeout(openPopup, POPUP_DELAY);
  }

  if (popupClose) popupClose.addEventListener('click', closePopup);
  if (popupSkip)  popupSkip.addEventListener('click', closePopup);

  if (popupOverlay) {
    popupOverlay.addEventListener('click', function (e) {
      if (e.target === popupOverlay) closePopup();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && popupOverlay &&
        popupOverlay.classList.contains('is-visible')) {
      closePopup();
    }
  });

  if (popupForm) {
    popupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const value = popupEmail.value.trim();

      if (!isValidEmail(value)) {
        popupForm.classList.add('has-error');
        popupError.textContent = 'Please enter a valid email address.';
        popupEmail.focus();
        return;
      }

      popupForm.classList.remove('has-error');
      popupError.textContent = '';
      showToast('Done! Your free taster is on its way. ☕');
      closePopup();
      popupForm.reset();
    });

    popupEmail.addEventListener('input', function () {
      if (popupForm.classList.contains('has-error')) {
        popupForm.classList.remove('has-error');
        popupError.textContent = '';
      }
    });
  }

  /* ==========================================================
     J. CONTACT FORM VALIDATION
     ========================================================== */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function setFieldState(field, valid, message) {
    const wrapper = field.closest('.form-field');
    const errorEl = wrapper ? wrapper.querySelector('.form-error') : null;

    if (!wrapper) return;

    wrapper.classList.toggle('has-error', !valid);
    wrapper.classList.toggle('is-valid', valid && field.value.trim() !== '');

    if (errorEl) errorEl.textContent = valid ? '' : message;
  }

  if (contactForm) {
    const nameField    = contactForm.querySelector('#name');
    const emailField   = contactForm.querySelector('#email');
    const messageField = contactForm.querySelector('#message');

    function validateName() {
      const v = nameField.value.trim();
      if (!v) { setFieldState(nameField, false, 'Please enter your name.'); return false; }
      if (v.length < 2) { setFieldState(nameField, false, 'Name is too short.'); return false; }
      setFieldState(nameField, true);
      return true;
    }

    function validateEmail() {
      const v = emailField.value.trim();
      if (!v) { setFieldState(emailField, false, 'Please enter your email.'); return false; }
      if (!isValidEmail(v)) { setFieldState(emailField, false, 'Enter a valid email.'); return false; }
      setFieldState(emailField, true);
      return true;
    }

    function validateMessage() {
      const v = messageField.value.trim();
      if (!v) { setFieldState(messageField, false, 'Please write a message.'); return false; }
      if (v.length < 10) { setFieldState(messageField, false, 'Message is too short.'); return false; }
      setFieldState(messageField, true);
      return true;
    }

    [nameField, emailField, messageField].forEach(function (field) {
      field.addEventListener('blur', function () {
        if (field === nameField)    validateName();
        if (field === emailField)   validateEmail();
        if (field === messageField) validateMessage();
      });
      field.addEventListener('input', function () {
        const wrapper = field.closest('.form-field');
        if (wrapper && wrapper.classList.contains('has-error')) {
          if (field === nameField)    validateName();
          if (field === emailField)   validateEmail();
          if (field === messageField) validateMessage();
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const okName    = validateName();
      const okEmail   = validateEmail();
      const okMessage = validateMessage();

      if (!(okName && okEmail && okMessage)) {
        const firstError = contactForm.querySelector('.form-field.has-error input, .form-field.has-error textarea');
        if (firstError) firstError.focus();
        return;
      }

      showToast('Message sent! We\u2019ll reply within a day. ☕');
      contactForm.reset();
      contactForm.querySelectorAll('.form-field').forEach(function (f) {
        f.classList.remove('is-valid', 'has-error');
      });
    });
  }

  /* ==========================================================
     K. RESIZE
     ========================================================== */
  let resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 720) closeMenu();
    }, 150);
  });

  /* ==========================================================
     L. AUTO-YEAR IN FOOTER
     ========================================================== */
  const yearEl = document.querySelector('.footer-bottom span');
  if (yearEl) {
    yearEl.textContent = yearEl.textContent.replace(
      /\d{4}/,
      new Date().getFullYear()
    );
  }

})();