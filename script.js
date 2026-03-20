/* ============================
   Wedding Invitation – Premium Script
   ============================ */

(function () {
  'use strict';

  const overlay    = document.getElementById('curtainOverlay');
  const page       = document.getElementById('page');
  const canvas     = document.getElementById('sparkleCanvas');
  const ctx        = canvas.getContext('2d');
  const musicBtn   = document.getElementById('musicBtn');
  const bgMusic    = document.getElementById('bgMusic');
  const petalsBox  = document.getElementById('petalsContainer');

  /* ==========================================================
     1. CURTAIN OPENING + GOLD SPARKLES
     ========================================================== */

  let opened = false;

  function openCurtains() {
    if (opened) return;
    opened = true;

    overlay.classList.add('opened');
    page.classList.add('revealed');
    launchSparkles();

    setTimeout(() => {
      overlay.classList.add('dismissed');
      musicBtn.classList.add('visible');
      spawnPetals();
    }, 1100);

    setTimeout(() => { overlay.remove(); }, 1800);
  }

  overlay.addEventListener('click', openCurtains);
  overlay.addEventListener('touchstart', openCurtains, { passive: true });

  /* ==========================================================
     2. GOLD SPARKLE / CONFETTI BURST
     ========================================================== */

  function launchSparkles() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const COLORS = ['#c9a84c', '#e0cc8a', '#fff8e1', '#f5d5d8', '#ffffff'];
    const particles = [];

    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        r: 1.5 + Math.random() * 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
        decay: .008 + Math.random() * .012,
        gravity: .04 + Math.random() * .03
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.life -= p.decay;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      if (alive) requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  /* ==========================================================
     3. FLOATING FLOWER PETALS
     ========================================================== */

  function spawnPetals() {
    const COUNT = 18;
    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('div');
      el.className = 'petal';
      el.style.left = Math.random() * 100 + '%';
      el.style.animationDuration = (9 + Math.random() * 8) + 's';
      el.style.animationDelay = (Math.random() * 10) + 's';
      petalsBox.appendChild(el);
    }
  }

  /* ==========================================================
     4. PARALLAX ON HERO IMAGE
     ========================================================== */

  const heroImg = document.querySelector('.hero-img');
  const hero    = document.querySelector('.hero');

  function parallax() {
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const scrolled = window.scrollY;
    const offset = scrolled * 0.35;
    heroImg.style.transform = 'translateY(' + offset + 'px)';
  }

  window.addEventListener('scroll', () => requestAnimationFrame(parallax), { passive: true });

  /* ==========================================================
     5. COUNTDOWN (with count-up animation on first view)
     ========================================================== */

  const target = new Date('2026-04-12T06:00:00+05:30').getTime();
  const $d = document.getElementById('cd-days');
  const $h = document.getElementById('cd-hours');
  const $m = document.getElementById('cd-mins');
  let countdownAnimated = false;

  function getRemaining() {
    const diff = Math.max(0, target - Date.now());
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000)
    };
  }

  function setCountdown(vals) {
    $d.textContent = vals.d;
    $h.textContent = vals.h;
    $m.textContent = vals.m;
  }

  function animateCountUp() {
    if (countdownAnimated) return;
    countdownAnimated = true;
    const final = getRemaining();
    const duration = 1200;
    const start = performance.now();

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCountdown({
        d: Math.round(final.d * ease),
        h: Math.round(final.h * ease),
        m: Math.round(final.m * ease)
      });
      if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  setInterval(() => { if (countdownAnimated) setCountdown(getRemaining()); }, 30000);

  /* ==========================================================
     6. SCROLL-REVEAL SECTIONS + COUNTDOWN TRIGGER
     ========================================================== */

  const sections = document.querySelectorAll('.sec');
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          if (e.target.id === 'countdown') animateCountUp();
          sectionObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ==========================================================
     7. MUSIC TOGGLE
     ========================================================== */

  let playing = false;

  musicBtn.addEventListener('click', () => {
    if (playing) {
      bgMusic.pause();
      musicBtn.classList.remove('playing');
    } else {
      bgMusic.play().catch(() => {});
      musicBtn.classList.add('playing');
    }
    playing = !playing;
  });

})();
