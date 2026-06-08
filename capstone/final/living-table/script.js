/* =============================================
   DAVIS 2045 — THE LIVING TABLE
   script.js
============================================= */

/* -----------------------------------------------
   PARTICLE SYSTEM
----------------------------------------------- */
(function () {
  const canvas = document.querySelector('#hero-canvas');
  const ctx    = canvas.getContext('2d');
  let pts = [];
  let raf;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function Particle() { this.reset(true); }

  Particle.prototype.reset = function (init) {
    this.x       = Math.random() * canvas.width;
    this.y       = init ? Math.random() * canvas.height : canvas.height + 20;
    this.r       = Math.random() * 2.5 + .4;
    this.vx      = (Math.random() - .5) * .45;
    this.vy      = -(Math.random() * .75 + .25);
    this.life    = init ? Math.random() * 260 : 0;
    this.maxLife = Math.random() * 280 + 160;
    this.maxOp   = Math.random() * .55 + .08;
    this.op      = 0;
    this.gold    = Math.random() > .52;
  };

  Particle.prototype.tick = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    const t = this.life / this.maxLife;
    this.op = t < .12
      ? (t / .12) * this.maxOp
      : t > .88
        ? ((1 - t) / .12) * this.maxOp
        : this.maxOp;
    if (this.life >= this.maxLife) this.reset(false);
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.op;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.gold ? '#f2d080' : '#47a87a';
    ctx.fill();
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 4.5);
    g.addColorStop(0, this.gold ? 'rgba(242,208,128,.28)' : 'rgba(71,168,122,.2)');
    g.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r * 4.5, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  };

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => { p.tick(); p.draw(); });
    raf = requestAnimationFrame(loop);
  }

  resize();
  pts = Array.from({ length: 90 }, () => new Particle());
  loop();

  window.addEventListener('resize', () => { resize(); pts = Array.from({ length: 90 }, () => new Particle()); });

  // pause when scrolled off screen
  new IntersectionObserver(entries => {
    entries[0].isIntersecting ? loop() : cancelAnimationFrame(raf);
  }).observe(canvas);
})();


/* -----------------------------------------------
   SCROLL REVEAL
----------------------------------------------- */
const rObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .14, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => rObs.observe(el));


/* -----------------------------------------------
   HERO PARALLAX
----------------------------------------------- */
const heroContent = document.querySelector('.hero-content');
const raysEl      = document.querySelector('.rays');

window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  if (heroContent) heroContent.style.transform = `translateY(${sy * .28}px)`;
  if (raysEl)      raysEl.style.transform = `translateX(-50%) rotate(${sy * .018}deg)`;
}, { passive: true });


/* -----------------------------------------------
   DRIFTING LEAF SPAWNER
----------------------------------------------- */
(function () {
  const hero = document.querySelector('#hero');
  const SVGS = [
    `<svg viewBox="0 0 32 54" fill="none"><path d="M16 51C16 51 2 39 2 22C2 7 16 1 16 1C16 1 30 7 30 22C30 39 16 51 16 51Z" fill="COLOR"/></svg>`,
    `<svg viewBox="0 0 46 34" fill="none"><path d="M1 17C1 17 12 2 23 1C34 0 45 12 45 17C45 22 34 34 23 33C12 32 1 17 1 17Z" fill="COLOR"/></svg>`,
  ];
  const colors = ['#47a87a', '#b2dfc2', '#2a6d48', '#f2d080'];

  function spawnLeaf() {
    const leaf  = document.createElement('div');
    leaf.className = 'hero-leaf';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size  = Math.random() * 28 + 14;
    leaf.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 20}%;
      width: ${size}px;
      animation-duration: ${Math.random() * 12 + 10}s;
      animation-delay: ${Math.random() * 2}s;
    `;
    leaf.innerHTML = SVGS[Math.floor(Math.random() * SVGS.length)].replace('COLOR', color);
    hero.appendChild(leaf);
    leaf.addEventListener('animationend', () => leaf.remove(), { once: true });
  }

  spawnLeaf(); spawnLeaf();
  setInterval(spawnLeaf, 3200);
})();


/* -----------------------------------------------
   SUSTAINABILITY SCORES
----------------------------------------------- */
const SCORES = {
  'Vertical Kale':     98,
  'Heirloom Tomato':   90,
  'Rainbow Carrot':    85,
  'Living Microgreens':99,
  'Spiced Lentils':    92,
  'Mycelium Mushroom': 97,
  'Solar-Fed Egg':     80,
  'Cultured Tempeh':   95,
  'Ancient Farro':     88,
  'Water-Wise Rice':   85,
  'Wild Sourdough':    90,
  'Solar-Fired Roast': 98,
  'Steam Harvest':     90,
  'Raw & Living':      99,
  'Slow Clay Braise':  78,
};

function calcScore() {
  const vals = Object.values(picks).filter(Boolean);
  if (!vals.length) return 0;
  const total = vals.reduce((sum, name) => sum + (SCORES[name] ?? 80), 0);
  return Math.round(total / vals.length);
}

function animateScore(score) {
  const circumference = 2 * Math.PI * 42; // ≈ 264
  const offset = circumference - (score / 100) * circumference;
  const ring  = document.querySelector('#rv-ring-fill');
  const numEl = document.querySelector('#rv-score-num');

  // Color: green for excellent, gold for good, warm for lower
  ring.style.stroke = score >= 90 ? '#47a87a' : score >= 75 ? '#f2d080' : '#e6b55e';
  ring.style.strokeDashoffset = circumference;

  // Trigger CSS transition on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ring.style.strokeDashoffset = offset;
    });
  });

  // Count-up number
  let current = 0;
  const step  = score / 60;
  const timer = setInterval(() => {
    current = Math.min(current + step, score);
    numEl.textContent = Math.round(current);
    if (current >= score) clearInterval(timer);
  }, 25);
}


/* -----------------------------------------------
   INGREDIENT SELECTION
----------------------------------------------- */
const picks = { veg: null, pro: null, grain: null, method: null };

document.querySelectorAll('.ing-card').forEach(card => {
  card.addEventListener('click', () => {
    const cat  = card.dataset.cat;
    const name = card.dataset.name;

    document.querySelectorAll(`.ing-card[data-cat="${cat}"]`).forEach(c => c.classList.remove('sel'));

    picks[cat] = (picks[cat] === name) ? null : name;
    if (picks[cat]) card.classList.add('sel');

    updateBar();
  });
});

function updateBar() {
  const row = document.querySelector('#chips-row');
  const btn = document.querySelector('#complete-btn');
  const filled = Object.values(picks).filter(Boolean);

  if (!filled.length) {
    row.innerHTML = '<span class="chip-hint">Your selections will appear here…</span>';
  } else {
    row.innerHTML = '';
    Object.values(picks).forEach(name => {
      if (!name) return;
      const card  = document.querySelector(`.ing-card[data-name="${CSS.escape(name)}"]`);
      const emoji = card ? card.dataset.emoji : '';
      const chip  = document.createElement('span');
      chip.className   = 'meal-chip';
      chip.textContent = `${emoji} ${name}`;
      row.appendChild(chip);
    });
  }

  btn.classList.toggle('ready', Object.values(picks).every(Boolean));
}


/* -----------------------------------------------
   MEAL GENERATION
----------------------------------------------- */
const methodPhrase = {
  'Solar-Fired Roast': 'kissed by concentrated solar heat until the edges caramelise and the sugars sing',
  'Steam Harvest':     'coaxed open by soft steam drawn from reclaimed rainwater — nothing lost, everything preserved',
  'Raw & Living':      'left entirely as nature grew it, brightened with pressed citrus and cold-pressed grove oil',
  'Slow Clay Braise':  'nestled in terracotta and left to deepen over seventy-two hours, becoming something slow and profound',
};
const grainPhrase = {
  'Ancient Farro':   'a bed of ancient farro — nutty, chewy, honest',
  'Water-Wise Rice': 'water-wise jasmine rice, each grain separate and luminous',
  'Wild Sourdough':  "torn wild sourdough from the city's 1979 starter, warm from the solar oven",
};
const vegPretty = {
  'Vertical Kale':     ['Tower Kale', 'Seventh-Floor Green', 'Midnight Kale'],
  'Heirloom Tomato':   ['Glass-Grown Crimson', 'Rooftop Tomato', 'Solar-Blushed Tomato'],
  'Rainbow Carrot':    ['Valley Rainbow', 'Prism Root', 'Hydro-Grown Carrot'],
  'Living Microgreens':['First-Light Greens', 'Breathing Garden', 'Morning Microgreens'],
};

function makeDishName(veg, pro, grain) {
  const arr   = vegPretty[veg] || [veg];
  const vName = arr[Math.floor(Math.random() * arr.length)];

  return `${vName}\nWith ${pro}\nOver ${grain}`;
}

function makeDishDesc(veg, pro, method, grain) {
  const mp = methodPhrase[method] || 'prepared with intention';
  const gp = grainPhrase[grain]   || 'a bed of grain';
  return `Tonight's ${veg.toLowerCase()}, grown in the vertical gardens just hours ago${mp}. ` +
    `It arrives at your table over ${gp}, beside ${pro.toLowerCase()} ` +
    `that carries the memory of the soil it came from. This is a meal that you know is local.`;
}


/* -----------------------------------------------
   REVEAL OPEN / CLOSE
----------------------------------------------- */
function openReveal() {
  const { veg, pro, grain, method } = picks;
  if (!veg || !pro || !grain || !method) return;

  document.querySelector('#rv-name').innerHTML =
    makeDishName(veg, pro, grain).replace(/\n/g, '<br>');
  document.querySelector('#rv-desc').textContent =
    makeDishDesc(veg, pro, method, grain);

  document.querySelector('#rv-co2').textContent = (Math.random() * .25 + .08).toFixed(2) + ' kg';
  document.querySelector('#rv-h2o').textContent = (Math.random() * .7  + .4 ).toFixed(1) + ' L';
  document.querySelector('#rv-mi' ).textContent = Math.floor(Math.random() * 22 + 4) + ' mi';

  // Reset + animate score ring
  const ring  = document.querySelector('#rv-ring-fill');
  const numEl = document.querySelector('#rv-score-num');
  ring.style.strokeDashoffset = 264;
  numEl.textContent = '0';

  const overlay = document.querySelector('#meal-reveal');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  spawnConfetti(overlay.querySelector('.rv-wrap'));

  // Delay score animation slightly so overlay is visible first
  setTimeout(() => animateScore(calcScore()), 400);
}

function closeReveal() {
  document.querySelector('#meal-reveal').classList.remove('open');
  document.body.style.overflow = '';
}

function resetBuilder() {
  closeReveal();
  Object.keys(picks).forEach(k => picks[k] = null);
  document.querySelectorAll('.ing-card').forEach(c => c.classList.remove('sel'));
  updateBar();
  setTimeout(() => {
    document.querySelector('#meal-builder').scrollIntoView({ behavior: 'smooth' });
  }, 300);
}

// Wire up buttons
document.querySelector('#complete-btn').addEventListener('click', openReveal);
document.querySelector('.rv-close').addEventListener('click', closeReveal);
document.querySelector('#rv-enjoy').addEventListener('click', closeReveal);
document.querySelector('#rv-again').addEventListener('click', resetBuilder);

// Close on backdrop click
document.querySelector('#meal-reveal').addEventListener('click', e => {
  if (e.target === document.querySelector('#meal-reveal')) closeReveal();
});

// ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeReveal();
});


/* -----------------------------------------------
   CONFETTI BURST
----------------------------------------------- */
function spawnConfetti(target) {
  const colors = ['#47a87a', '#f2d080', '#b2dfc2', '#e6b55e', '#fff', '#c4d06e'];
  for (let i = 0; i < 28; i++) {
    const dot   = document.createElement('div');
    dot.className = 'confetti-dot';
    const size  = Math.random() * 7 + 3;
    const angle = Math.random() * 360;
    const dist  = Math.random() * 180 + 60;
    dot.style.cssText = `
      width: ${size}px; height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${50 + Math.cos(angle * Math.PI / 180) * dist * .3}%;
      bottom: ${30 + Math.random() * 30}%;
      animation-duration: ${Math.random() * .8 + .7}s;
      animation-delay: ${Math.random() * .4}s;
      opacity: .85;
    `;
    target.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove(), { once: true });
  }
}
