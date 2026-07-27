/**
 * Carine & Micheal — Wedding Invitation
 * Vanilla JS: countdown, RSVP, animations, confetti
 */

(function () {
  'use strict';

  // Wedding date: September 5, 2026 at 7:00 PM (Cairo, Egypt — UTC+3)
  const WEDDING_DATE = new Date('2026-09-05T19:00:00+03:00');

  // ---- DOM Elements ----
  const loader = document.getElementById('loader');
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const openInvitationBtn = document.getElementById('openInvitation');
  const backToTop = document.getElementById('backToTop');
  const musicBtn = document.getElementById('musicBtn');
  const bgMusic = document.getElementById('bgMusic');
  const rsvpForm = document.getElementById('rsvpForm');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const revealElements = document.querySelectorAll('.reveal');

  // ---- Loading Screen ----
  function initLoader() {
    document.body.classList.add('loading');

    const hideLoader = () => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      triggerHeroAnimations();
    };

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 1800);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 1800));
    }
  }

  function triggerHeroAnimations() {
    const heroReveals = document.querySelectorAll('.hero .reveal');
    heroReveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }

  // ---- Navigation ----
  function initNavigation() {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
      backToTop.classList.toggle('visible', window.scrollY > 600);
      backToTop.hidden = window.scrollY <= 600;
      updateActiveNavLink();
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  // ---- Smooth Scroll ----
  function initSmoothScroll() {
    openInvitationBtn.addEventListener('click', () => {
      document.getElementById('countdown').scrollIntoView({ behavior: 'smooth' });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ---- Countdown Timer ----
  function initCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
      const now = new Date();
      const diff = WEDDING_DATE - now;

      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ---- Scroll Reveal ----
  function initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => {
      if (!el.closest('.hero')) {
        observer.observe(el);
      }
    });
  }

  // ---- Music Toggle ----
  function initMusic() {
    musicBtn.addEventListener('click', async () => {
      try {
        if (bgMusic.paused) {
          await bgMusic.play();
          musicBtn.classList.add('playing');
          musicBtn.setAttribute('aria-pressed', 'true');
          musicBtn.setAttribute('aria-label', 'Pause background music');
        } else {
          bgMusic.pause();
          musicBtn.classList.remove('playing');
          musicBtn.setAttribute('aria-pressed', 'false');
          musicBtn.setAttribute('aria-label', 'Play background music');
        }
      } catch {
        console.warn('Audio playback requires user interaction.');
      }
    });
  }

  // ---- RSVP Form (FormSubmit — native POST, no JS interception) ----
  function initRSVP() {
    if (!rsvpForm) return;

    rsvpForm.addEventListener('submit', () => {
      const submitBtn = rsvpForm.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      submitBtn.disabled = true;
      const label = submitBtn.querySelector('span');
      if (label) label.textContent = 'Sending...';
    });
  }

  // ---- Confetti Animation ----
  function launchConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = ['#800020', '#D4AF37', '#FFFFFF', '#a0002a', '#e8c96a'];
    const particles = [];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: Math.random() * 3 + 2,
        opacity: 1
      });
    }

    let frame = 0;
    const maxFrames = 180;

    function animate() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      particles.forEach(p => {
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.velocityY += 0.05;
        p.rotation += p.rotationSpeed;

        if (frame > maxFrames * 0.6) {
          p.opacity -= 0.02;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      frame++;
      if (frame < maxFrames) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    animate();
  }

  // ---- Initialize ----
  function init() {
    initLoader();
    initNavigation();
    initSmoothScroll();
    initCountdown();
    initScrollReveal();
    initMusic();
    initRSVP();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();