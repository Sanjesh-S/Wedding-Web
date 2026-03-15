(function () {
  var overlay = document.getElementById('curtainOverlay');
  var main = document.getElementById('mainContent');

  function openCurtains() {
    if (!overlay || overlay.classList.contains('curtains-open')) return;
    overlay.classList.add('curtains-open');
    if (main) main.classList.add('revealed');
    var hero = document.querySelector('.hero');
    if (hero) hero.classList.add('in-view');
  }

  if (overlay) {
    overlay.addEventListener('click', openCurtains);
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCurtains();
      }
    });
  }

  // Countdown to 11 April 2026, 6:00 PM IST
  var receptionDate = new Date('2026-04-11T18:00:00+05:30');
  var countdownEl = document.getElementById('countdown');
  var daysEl = document.getElementById('countdown-days');
  var hoursEl = document.getElementById('countdown-hours');
  var minsEl = document.getElementById('countdown-mins');
  var secsEl = document.getElementById('countdown-secs');

  function updateCountdown() {
    var now = new Date();
    var diff = receptionDate - now;
    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '0';
      if (hoursEl) hoursEl.textContent = '0';
      if (minsEl) minsEl.textContent = '0';
      if (secsEl) secsEl.textContent = '0';
      return;
    }
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((diff % (1000 * 60)) / 1000);
    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }

  if (countdownEl) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Scratch-off: draw metallic overlay and erase on pointer move
  var scratchCards = document.querySelectorAll('.scratch-card');
  var celebrationEl = document.getElementById('scratchCelebration');
  var scratchedCount = 0;
  var celebrationShown = false;

  function drawMetallic(ctx, w, h) {
    var gradient = ctx.createRadial-gradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.8);
    gradient.addColorStop(0, '#e8d48b');
    gradient.addColorStop(0.35, '#c9a227');
    gradient.addColorStop(0.6, '#b8860b');
    gradient.addColorStop(1, '#8b6914');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    for (var i = 0; i < 40; i++) {
      var x = Math.random() * w;
      var y = Math.random() * h;
      var r = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initScratch(card) {
    var canvas = card.querySelector('.scratch-canvas');
    if (!canvas) return;

    var rect = card.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    var size = Math.min(rect.width, rect.height, 120);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    var w = size;
    var h = size;

    var gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.8);
    gradient.addColorStop(0, '#e8d48b');
    gradient.addColorStop(0.35, '#c9a227');
    gradient.addColorStop(0.6, '#b8860b');
    gradient.addColorStop(1, '#8b6914');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (var i = 0; i < 50; i++) {
      var x = Math.random() * w;
      var y = Math.random() * h;
      var r = 0.5 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    var radius = 18;
    var isScratching = false;
    var totalPixels = w * h;
    var clearedPixels = 0;

    function getPos(e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX) - r.left;
      var y = (e.clientY !== undefined ? e.clientY : e.touches[0].clientY) - r.top;
      var scaleX = w / r.width;
      var scaleY = h / r.height;
      return { x: x * scaleX, y: y * scaleY };
    }

    function scratch(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      clearedPixels += Math.PI * radius * radius;
      if (clearedPixels > totalPixels * 0.4 && !card.classList.contains('scratched')) {
        card.classList.add('scratched');
        scratchedCount++;
        if (celebrationEl && scratchedCount >= 3 && !celebrationShown) {
          celebrationShown = true;
          celebrationEl.textContent = 'Celebrations!';
          celebrationEl.classList.add('celebrating');
        }
      }
    }

    function onStart(e) {
      e.preventDefault();
      isScratching = true;
      var pos = getPos(e);
      scratch(pos.x, pos.y);
    }

    function onMove(e) {
      if (!isScratching) return;
      e.preventDefault();
      var pos = getPos(e);
      scratch(pos.x, pos.y);
    }

    function onEnd() {
      isScratching = false;
    }

    canvas.addEventListener('mousedown', onStart);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onEnd);
    canvas.addEventListener('mouseleave', onEnd);
    card.addEventListener('touchstart', onStart, { passive: false });
    card.addEventListener('touchmove', onMove, { passive: false });
    card.addEventListener('touchend', onEnd);
  }

  function initScratchWhenVisible() {
    scratchCards.forEach(function (card) {
      var canvas = card.querySelector('.scratch-canvas');
      if (canvas && !canvas.dataset.inited) {
        canvas.dataset.inited = '1';
        initScratch(card);
      }
    });
  }

  if (scratchCards.length) {
    var scratchSection = document.querySelector('.scratch-section');
    if (scratchSection && typeof IntersectionObserver !== 'undefined') {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) initScratchWhenVisible();
          });
        },
        { threshold: 0.2 }
      );
      io.observe(scratchSection);
    } else {
      initScratchWhenVisible();
    }
  }

  // Scroll reveal
  var sections = document.querySelectorAll('.hero, .scratch-section, .countdown-section, .venue-section, .contact');
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );
  sections.forEach(function (el) {
    el.classList.add('reveal-section');
    observer.observe(el);
  });
})();
