'use strict';
/**
 * DAVIS 2045 — THE LIVING TABLE
 * script.js
 *
 * Sections:
 *  1.  Ingredient Data
 *  2.  App State
 *  3.  Hero Particle System
 *  4.  GSAP + ScrollTrigger
 *  5.  AOS Init
 *  6.  Ingredient Card Interactions
 *  7.  Fly-to-Plate Animation
 *  8.  Plate Layer Update / Clear
 *  9.  Sustainability Info Panel
 * 10.  Mini Score Bars
 * 11.  Reveal Button State
 * 12.  Score Calculation
 * 13.  Meal Reveal Overlay
 * 14.  Score Ring Animation
 * 15.  Narrative + Dish Name Generation
 * 16.  Ingredient Breakdown HTML
 * 17.  Reset
 * 18.  DOMContentLoaded — Bootstrap
 */


/* ═══════════════════════════════════════════════
   1. INGREDIENT DATA
   ─ score: 0–100 sustainability rating
   ─ img: path to your illustrated PNG (transparent bg)
   ─ plateEffect: CSS glow class for cooking method
═══════════════════════════════════════════════ */
const INGREDIENTS = {

  /* ── Vegetables ──────────────────────────── */
  'Vertical Kale': {
    category: 'veg', emoji: '🌿',
    img: 'images/ingredients/kale.png', color: '#3d8b62',
    score: 94, water: '0.5 L', carbon: '0.05 kg CO₂', local: 'Tower 3, Davis',
    plateEffect: null,
    fact: 'Grown without soil or sunlight. Uses 95% less water than field kale and zero pesticides.',
  },
  'Heirloom Tomato': {
    category: 'veg', emoji: '🍅',
    img: 'images/ingredients/tomato.png', color: '#c94a3a',
    score: 87, water: '0.9 L', carbon: '0.08 kg CO₂', local: 'Rooftop Solar Greenhouse',
    plateEffect: null,
    fact: 'Solar greenhouse tomatoes contain 30% more lycopene than conventionally grown varieties.',
  },
  'Rainbow Carrot': {
    category: 'veg', emoji: '🥕',
    img: 'images/ingredients/carrot.png', color: '#d96b2a',
    score: 90, water: '0.6 L', carbon: '0.06 kg CO₂', local: 'City Farm Collective',
    plateEffect: null,
    fact: 'Rainbow carrots restore biodiversity — each color hosts different beneficial gut bacteria.',
  },
  'Living Microgreens': {
    category: 'veg', emoji: '🌱',
    img: 'images/ingredients/microgreens.png', color: '#5aad6e',
    score: 98, water: '0.2 L', carbon: '0.02 kg CO₂', local: 'Harvested This Morning',
    plateEffect: null,
    fact: 'Microgreens contain up to 40× more nutrients per gram than their fully-grown counterparts.',
  },

  /* ── Proteins ────────────────────────────── */
  'Spiced Lentils': {
    category: 'pro', emoji: '🫘',
    img: 'images/ingredients/lentils.png', color: '#8b6344',
    score: 92, water: '1.0 L', carbon: '0.10 kg CO₂', local: 'Valley Dry-Farm',
    plateEffect: null,
    fact: 'Lentils fix nitrogen in the soil, reducing the need for synthetic fertilizers on surrounding farms.',
  },
  'Mycelium Mushroom': {
    category: 'pro', emoji: '🍄',
    img: 'images/ingredients/mushroom.png', color: '#9b7e5a',
    score: 96, water: '0.4 L', carbon: '0.04 kg CO₂', local: 'Coffee-Substrate Lab',
    plateEffect: null,
    fact: 'Grown in recycled coffee grounds — mycelium mushrooms produce protein using a closed waste loop.',
  },
  'Solar-Fed Egg': {
    category: 'pro', emoji: '🥚',
    img: 'images/ingredients/egg.png', color: '#c8a030',
    score: 78, water: '1.8 L', carbon: '0.28 kg CO₂', local: 'East Commons Flock',
    plateEffect: null,
    fact: 'City chickens reduce household food waste by eating kitchen scraps — each egg is a closed loop.',
  },
  'Cultured Tempeh': {
    category: 'pro', emoji: '🌰',
    img: 'images/ingredients/tempeh.png', color: '#c4a56e',
    score: 88, water: '0.7 L', carbon: '0.07 kg CO₂', local: 'Local Fermentation Lab',
    plateEffect: null,
    fact: 'Fermentation increases nutrient bioavailability by 300% compared to unprocessed soybeans.',
  },

  /* ── Grains ──────────────────────────────── */
  'Ancient Farro': {
    category: 'grain', emoji: '🌾',
    img: 'images/ingredients/farro.png', color: '#c4a040',
    score: 91, water: '1.2 L', carbon: '0.12 kg CO₂', local: 'Regional Heirloom Farm',
    plateEffect: null,
    fact: 'Farro has been grown for 7,000 years. It naturally resists pests, requiring zero pesticides.',
  },
  'Water-Wise Rice': {
    category: 'grain', emoji: '🍚',
    img: 'images/ingredients/rice.png', color: '#a09070',
    score: 82, water: '1.6 L', carbon: '0.18 kg CO₂', local: 'Sacramento Delta',
    plateEffect: null,
    fact: 'Low-water paddy rice uses 60% less water than traditional flooding, preserving aquifer levels.',
  },
  'Wild Sourdough': {
    category: 'grain', emoji: '🍞',
    img: 'images/ingredients/sourdough.png', color: '#c08040',
    score: 88, water: '0.9 L', carbon: '0.09 kg CO₂', local: '1979 Starter, City Bakery',
    plateEffect: null,
    fact: "Davis's wild yeast starter has been alive since 1979. Sourdough pre-digests gluten for better absorption.",
  },

  /* ── Cooking Methods ─────────────────────── */
  'Solar-Fired Roast': {
    category: 'method', emoji: '☀️',
    img: null, color: '#f0b030',
    score: 98, water: '0 L', carbon: '0.00 kg CO₂', local: 'Zero import energy',
    plateEffect: 'glow-gold',
    fact: 'Concentrated solar cooking produces zero carbon emissions and preserves more minerals than gas cooking.',
  },
  'Steam Harvest': {
    category: 'method', emoji: '💨',
    img: null, color: '#4488aa',
    score: 94, water: '0.3 L recycled', carbon: '0.01 kg CO₂', local: 'Reclaimed water system',
    plateEffect: 'glow-blue',
    fact: 'Steaming retains 40% more nutrients than boiling, and reclaimed-water steam uses zero new resources.',
  },
  'Raw & Living': {
    category: 'method', emoji: '🌿',
    img: null, color: '#5aad6e',
    score: 100, water: '0 L', carbon: '0.00 kg CO₂', local: 'No energy required',
    plateEffect: 'glow-green',
    fact: 'Raw preparation preserves all living enzymes and phytonutrients. Zero energy, full vitality.',
  },
  'Slow Clay Braise': {
    category: 'method', emoji: '🫕',
    img: null, color: '#b08060',
    score: 85, water: '0.5 L', carbon: '0.05 kg CO₂', local: 'Thermal energy storage',
    plateEffect: 'glow-amber',
    fact: 'Clay distributes heat 3× more evenly than metal, using less energy while deepening flavor over time.',
  },
};

/* Glow ring colors (used inline — avoids extra CSS class prefixes) */
const GLOW_COLORS = {
  'glow-gold':  'rgba(240,176,48,.24)',
  'glow-blue':  'rgba(68,136,170,.2)',
  'glow-green': 'rgba(90,173,110,.22)',
  'glow-amber': 'rgba(176,128,96,.2)',
};


/* ═══════════════════════════════════════════════
   2. APP STATE
═══════════════════════════════════════════════ */
let picks = { veg: null, pro: null, grain: null, method: null };


/* ═══════════════════════════════════════════════
   3. HERO PARTICLE SYSTEM
   Canvas floating particles — gold + sage green
═══════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let pts = [];
  let raf;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function Particle() { this.reset(true); }

  Particle.prototype.reset = function (scatter) {
    this.x       = Math.random() * canvas.width;
    this.y       = scatter ? Math.random() * canvas.height : canvas.height + 12;
    this.r       = Math.random() * 2.4 + 0.4;
    this.vx      = (Math.random() - 0.5) * 0.42;
    this.vy      = -(Math.random() * 0.7 + 0.22);
    this.life    = scatter ? Math.floor(Math.random() * 240) : 0;
    this.maxLife = Math.floor(Math.random() * 280 + 160);
    this.maxOp   = Math.random() * 0.55 + 0.08;
    this.op      = 0;
    this.gold    = Math.random() > 0.5;
  };

  Particle.prototype.tick = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    const t = this.life / this.maxLife;
    this.op = t < 0.12
      ? (t / 0.12) * this.maxOp
      : t > 0.88
        ? ((1 - t) / 0.12) * this.maxOp
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
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 5);
    g.addColorStop(0, this.gold ? 'rgba(242,208,128,.28)' : 'rgba(71,168,122,.2)');
    g.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r * 5, 0, Math.PI * 2);
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
  pts = Array.from({ length: 88 }, () => new Particle());
  loop();

  window.addEventListener('resize', () => {
    resize();
    pts.forEach(p => p.reset(true));
  });

  /* Pause when hero is off-screen (saves GPU) */
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) loop();
    else cancelAnimationFrame(raf);
  });
  obs.observe(canvas);
})();


/* ═══════════════════════════════════════════════
   4. GSAP + SCROLLTRIGGER
   Cinematic parallax + entrance animations
═══════════════════════════════════════════════ */
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  /* ── Hero parallax ─────────────────────────── */
  gsap.to('#hero-content', {
    yPercent: 32,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.rays', {
    rotation: 14,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
  });

  /* ── The Shift: quote scrubs into view ─────── */
  gsap.fromTo('.shift-quote',
    { opacity: 0, y: 58 },
    { opacity: 1, y: 0,
      scrollTrigger: { trigger: '#the-shift', start: 'top 80%', end: 'top 32%', scrub: 1.5 } }
  );
  gsap.fromTo('.shift-body',
    { opacity: 0, y: 38 },
    { opacity: 1, y: 0,
      scrollTrigger: { trigger: '#the-shift', start: 'top 66%', end: 'top 24%', scrub: 1.2 } }
  );

  /* ── Story stats slide in from right ──────── */
  gsap.from('.stat-card', {
    x: 60, opacity: 0, stagger: 0.18, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '.story-stats', start: 'top 74%', toggleActions: 'play none none reverse' },
  });

  /* ── Plate panel entrance ─────────────────── */
  gsap.from('#plate-panel', {
    y: 55, opacity: 0, duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '#meal-builder', start: 'top 72%', toggleActions: 'play none none reverse' },
  });

  /* ── Concepts grid fade-in (redundant with AOS but adds depth) */
  gsap.from('.c-card', {
    y: 35, opacity: 0, stagger: 0.1, duration: 0.75, ease: 'power2.out',
    scrollTrigger: { trigger: '.concepts-grid', start: 'top 78%', toggleActions: 'play none none none' },
  });
}


/* ═══════════════════════════════════════════════
   5. AOS INIT
   Lightweight fade/slide for smaller elements
═══════════════════════════════════════════════ */
function initAOS() {
  AOS.init({
    duration: 880,
    once: true,
    easing: 'ease-out-cubic',
    offset: 55,
  });
}


/* ═══════════════════════════════════════════════
   6. INGREDIENT CARD INTERACTIONS
═══════════════════════════════════════════════ */
function initCards() {
  document.querySelectorAll('.ing-card').forEach(card => {
    /* Click — select / deselect */
    card.addEventListener('click', () => onCardSelect(card));

    /* Hover — preview sustainability info */
    card.addEventListener('mouseenter', () => {
      const name = card.dataset.name;
      if (name && INGREDIENTS[name]) showSusPanel(name, INGREDIENTS[name]);
    });
  });
}

function onCardSelect(card) {
  const cat  = card.dataset.cat;
  const name = card.dataset.name;
  if (!cat || !name || !INGREDIENTS[name]) return;

  const data = INGREDIENTS[name];

  /* Deselect all cards in same category */
  document.querySelectorAll(`.ing-card[data-cat="${cat}"]`).forEach(c => c.classList.remove('sel'));

  if (picks[cat] === name) {
    /* Toggle off */
    picks[cat] = null;
    clearPlateLayer(cat);
    updateMiniScores(cat, null);
  } else {
    /* Select new */
    picks[cat] = name;
    card.classList.add('sel');
    flyToPlate(card, cat, data);
    updateMiniScores(cat, data.score);
    showSusPanel(name, data);
  }

  checkRevealReady();
}


/* ═══════════════════════════════════════════════
   7. FLY-TO-PLATE ANIMATION
   Ingredient emoji flies from card → plate slot
═══════════════════════════════════════════════ */
function flyToPlate(cardEl, cat, data) {
  /* Methods fly to plate center; others to their layer */
  const targetId = (cat === 'method') ? 'plate-outer' : `p-${cat}`;
  const targetEl = document.getElementById(targetId);

  if (!targetEl) {
    updatePlateLayer(cat, data);
    return;
  }

  const cR = cardEl.getBoundingClientRect();
  const tR = targetEl.getBoundingClientRect();

  const flyer = document.createElement('div');
  flyer.className = 'ing-flyer';
  flyer.textContent = data.emoji;
  flyer.style.cssText = `
    left: ${cR.left + cR.width  / 2 - 28}px;
    top:  ${cR.top  + cR.height / 2 - 28}px;
    background: ${data.color}28;
    border: 2px solid ${data.color};
    box-shadow: 0 0 20px ${data.color}66;
  `;
  document.body.appendChild(flyer);

  gsap.to(flyer, {
    left:    tR.left + tR.width  / 2 - 28,
    top:     tR.top  + tR.height / 2 - 28,
    scale:   0.45,
    opacity: 0,
    duration: 0.68,
    ease: 'power2.inOut',
    onComplete() {
      flyer.remove();
      updatePlateLayer(cat, data);
    },
  });
}


/* ═══════════════════════════════════════════════
   8. PLATE LAYER UPDATE / CLEAR
═══════════════════════════════════════════════ */
function updatePlateLayer(cat, data) {
  /* Method → glow ring only, no visual layer */
  if (cat === 'method') {
    applyGlowRing('plate-method-ring', data.plateEffect);
    applyGlowRing('rv-method-ring',    data.plateEffect);
    populateRevealLayer(cat, data);
    updateEmptyState();
    return;
  }

  /* Builder plate layer */
  const layer = document.getElementById(`p-${cat}`);
  const imgEl = document.getElementById(`p-${cat}-img`);
  const fbEl  = document.getElementById(`p-${cat}-fb`);

  /* Emoji fallback */
  if (fbEl) fbEl.textContent = data.emoji;

  /* Illustrated PNG (user-provided) */
  if (imgEl) {
    if (data.img) {
      imgEl.src = data.img;
      imgEl.alt = data.name || cat;
      imgEl.style.display = '';
      imgEl.onerror = () => { imgEl.style.display = 'none'; };
    } else {
      imgEl.style.display = 'none';
    }
  }

  /* Animate layer into view */
  if (layer) {
    layer.classList.add('show');
    gsap.fromTo(layer,
      { scale: 0.35, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.48, ease: 'back.out(2)' }
    );
  }

  /* Mirror to reveal overlay */
  populateRevealLayer(cat, data);
  updateEmptyState();
}

function clearPlateLayer(cat) {
  if (cat === 'method') {
    ['plate-method-ring', 'rv-method-ring'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.background = '';
      gsap.to(el, { opacity: 0, duration: 0.35 });
    });
    return;
  }

  /* Builder plate */
  const layer = document.getElementById(`p-${cat}`);
  if (layer) {
    gsap.to(layer, { scale: 0.6, opacity: 0, duration: 0.32,
      onComplete: () => layer.classList.remove('show') });
  }

  /* Reveal overlay */
  const rv = document.getElementById(`rv-${cat}`);
  if (rv) {
    rv.innerHTML = '';
    rv.style.opacity = '0';
    rv.classList.remove('show');
  }

  updateEmptyState();
}

/* Apply a radial glow ring to a method indicator */
function applyGlowRing(elementId, effectClass) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.style.background = '';
  if (!effectClass) { gsap.to(el, { opacity: 0, duration: 0.35 }); return; }

  const color = GLOW_COLORS[effectClass] || 'rgba(71,168,122,.2)';
  el.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
  gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.65, ease: 'power2.out' });
}

/* Populate matching layer in the reveal overlay plate */
function populateRevealLayer(cat, data) {
  if (cat === 'method') return; // glow ring handled by applyGlowRing

  const rv = document.getElementById(`rv-${cat}`);
  if (!rv) return;

  rv.style.position = 'relative';
  rv.innerHTML = `<span style="font-size:2.8rem;line-height:1;position:relative;z-index:1">${data.emoji}</span>`;

  if (data.img) {
    const img = document.createElement('img');
    img.src     = data.img;
    img.alt     = '';
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;z-index:2;';
    img.onerror = () => img.remove();
    rv.appendChild(img);
  }

  rv.classList.add('show');
  rv.style.opacity = '1';
}

/* Show/hide the "Build your meal" empty state message */
function updateEmptyState() {
  const empty = document.getElementById('plate-empty');
  if (!empty) return;
  const hasAny = Object.values(picks).some(Boolean);
  empty.classList.toggle('hidden', hasAny);
}


/* ═══════════════════════════════════════════════
   9. SUSTAINABILITY INFO PANEL
   Slides up from bottom-right on hover/select
═══════════════════════════════════════════════ */
function showSusPanel(name, data) {
  const panel = document.getElementById('sus-panel');
  if (!panel) return;

  /* Populate fields */
  document.getElementById('sus-name').textContent      = name;
  document.getElementById('sus-score-num').textContent = data.score;
  document.getElementById('sus-water').textContent     = data.water;
  document.getElementById('sus-carbon').textContent    = data.carbon;
  document.getElementById('sus-local').textContent     = data.local;
  document.getElementById('sus-fact').textContent      = data.fact;

  /* Animate score bar */
  const fill = document.getElementById('sus-bar-fill');
  if (fill) {
    fill.style.width = '0%';
    requestAnimationFrame(() => { fill.style.width = data.score + '%'; });
  }

  panel.setAttribute('aria-hidden', 'false');
  panel.classList.add('open');
}

function closeSusPanel() {
  const panel = document.getElementById('sus-panel');
  if (!panel) return;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
}


/* ═══════════════════════════════════════════════
   10. MINI SCORE BARS (in plate panel)
═══════════════════════════════════════════════ */
function updateMiniScores(cat, score) {
  const fill = document.getElementById(`mf-${cat}`);
  const val  = document.getElementById(`mv-${cat}`);
  if (fill) fill.style.width = score ? score + '%' : '0%';
  if (val)  val.textContent  = score !== null ? score : '—';
}


/* ═══════════════════════════════════════════════
   11. REVEAL BUTTON STATE
═══════════════════════════════════════════════ */
function checkRevealReady() {
  const btn   = document.getElementById('reveal-btn');
  if (!btn) return;
  const ready = Object.values(picks).every(Boolean);
  btn.disabled = !ready;
  btn.setAttribute('aria-disabled', String(!ready));
  btn.classList.toggle('ready', ready);
}


/* ═══════════════════════════════════════════════
   12. SCORE CALCULATION
   Weighted average of all 4 category scores
   + small bonus for zero-energy cooking methods
═══════════════════════════════════════════════ */
function calcScore() {
  const cats   = ['veg', 'pro', 'grain', 'method'];
  const scores = cats.map(cat => picks[cat] ? INGREDIENTS[picks[cat]].score : 0);
  const avg    = scores.reduce((a, b) => a + b, 0) / cats.length;
  const bonus  = (picks.method === 'Raw & Living' || picks.method === 'Solar-Fired Roast') ? 1.5 : 0;
  return Math.min(100, Math.round(avg + bonus));
}


/* ═══════════════════════════════════════════════
   13. MEAL REVEAL OVERLAY
═══════════════════════════════════════════════ */
function openReveal() {
  if (!Object.values(picks).every(Boolean)) return;

  const score     = calcScore();
  const dishName  = generateDishName();
  const narrative = generateNarrative(score);

  /* Populate overlay content */
  document.getElementById('rv-dish-name').textContent = dishName;
  document.getElementById('rv-narrative').textContent = narrative;
  document.getElementById('rv-breakdown').innerHTML   = buildBreakdown();

  /* Show overlay */
  const overlay = document.getElementById('meal-reveal');
  overlay.removeAttribute('hidden');
  overlay.style.opacity = '0';
  document.body.style.overflow = 'hidden';

  gsap.to(overlay, { opacity: 1, duration: 0.5, ease: 'power2.out' });

  /* Staggered entrance for children */
  gsap.from('.rv-left', { x: -40, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.15 });
  gsap.from('.rv-right',{ x:  40, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.25 });

  /* Score ring */
  setTimeout(() => animateScoreRing(score), 350);
}

function closeReveal() {
  const overlay = document.getElementById('meal-reveal');
  if (!overlay || overlay.hasAttribute('hidden')) return;
  gsap.to(overlay, {
    opacity: 0, duration: 0.4, ease: 'power2.in',
    onComplete() {
      overlay.setAttribute('hidden', '');
      overlay.style.opacity = '';
      document.body.style.overflow = '';
    },
  });
}


/* ═══════════════════════════════════════════════
   14. SCORE RING ANIMATION
   SVG stroke-dashoffset + counter number
═══════════════════════════════════════════════ */
function injectScoreGradient() {
  /* Inject an SVG <defs> with the gradient used by the score ring */
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg   = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
  svg.innerHTML = `
    <defs>
      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#47a87a"/>
        <stop offset="100%" stop-color="#f2d080"/>
      </linearGradient>
    </defs>`;
  document.body.insertBefore(svg, document.body.firstChild);
}

function animateScoreRing(score) {
  const ring  = document.getElementById('rv-ring-fill');
  const numEl = document.getElementById('rv-ring-num');
  if (!ring || !numEl) return;

  const r            = 56;                      // must match SVG r="56"
  const circumference = 2 * Math.PI * r;        // ≈ 351.9
  const offset       = circumference - (score / 100) * circumference;

  /* Force gradient stroke (needs injected <defs>) */
  ring.setAttribute('stroke', 'url(#scoreGrad)');
  ring.setAttribute('stroke-dasharray',  circumference);
  ring.setAttribute('stroke-dashoffset', circumference); // start empty

  /* Animate fill */
  gsap.to(ring, { attr: { strokeDashoffset: offset }, duration: 1.65, ease: 'power2.out', delay: 0.1 });

  /* Animate counter */
  const counter = { n: 0 };
  gsap.to(counter, {
    n: score, duration: 1.65, ease: 'power2.out', delay: 0.1,
    onUpdate() { numEl.textContent = Math.round(counter.n); },
  });

  /* Plate entrance */
  const rvPlate = document.getElementById('rv-plate-outer');
  if (rvPlate) {
    gsap.fromTo(rvPlate,
      { scale: 0.75, opacity: 0 },
      { scale: 1,    opacity: 1, duration: 0.85, ease: 'back.out(1.5)', delay: 0.05 }
    );
  }
}


/* ═══════════════════════════════════════════════
   15. NARRATIVE + DISH NAME GENERATION
═══════════════════════════════════════════════ */
function generateNarrative(score) {
  const { veg, pro, grain, method } = picks;

  /* Score-based opening */
  let opening;
  if (score >= 95)
    opening = 'Your choices tonight represent the highest ideals of regenerative dining. In 2045 Davis, meals like this are why the city became a global model.';
  else if (score >= 88)
    opening = 'Your meal reflects the sustainable dining principles that transformed California\'s food culture — each ingredient a deliberate act of care.';
  else if (score >= 80)
    opening = 'Your plate is a beautiful reflection of the living systems that feed Davis in 2045. Every choice here matters.';
  else
    opening = 'The journey toward a truly sustainable table is taken one meal at a time. Your plate is part of that story.';

  /* Method description */
  const methodDesc = {
    'Solar-Fired Roast': 'cooked entirely by sunlight — a meal whose fire leaves no trace on the earth',
    'Steam Harvest':     'gently opened by reclaimed water steam, every nutrient kept alive and whole',
    'Raw & Living':      'served exactly as the garden gave it, full of life and untouched by heat',
    'Slow Clay Braise':  'slow-braised in terracotta over low thermal heat — the oldest tradition, made sustainable',
  };
  const mDesc = methodDesc[method] || 'prepared with intention';

  /* Protein-specific detail */
  const proNotes = {
    'Mycelium Mushroom': " Your mushrooms grew in yesterday's coffee grounds — a perfect closed loop.",
    'Solar-Fed Egg':     " The city flock has been part of Davis's food story since 2032.",
    'Spiced Lentils':    ' Your lentils are fixing nitrogen in the valley soil even now, making the earth richer for the next harvest.',
    'Cultured Tempeh':   ' Your tempeh fermented for 48 hours, turning simple soybeans into something extraordinary.',
  };
  const proNote = proNotes[pro] || '';

  return `${opening} Your ${veg.toLowerCase()}, ${mDesc}, resting on ${grain.toLowerCase()} from the surrounding valley.${proNote}`;
}

function generateDishName() {
  const { veg, pro, grain, method } = picks;

  const vegAliases = {
    'Vertical Kale':     ['Tower Kale', 'Seventh-Floor Green', 'Midnight Kale'],
    'Heirloom Tomato':   ['Glass-Grown Crimson', 'Rooftop Tomato', 'Solar Crimson'],
    'Rainbow Carrot':    ['Valley Rainbow', 'Prism Root', 'Hydro-Grown Carrot'],
    'Living Microgreens':['First-Light Greens', 'Morning Microgreens', 'Breathing Garden'],
  };
  const methodWords = {
    'Solar-Fired Roast': 'Solar-Roasted',
    'Steam Harvest':     'Steam-Harvested',
    'Raw & Living':      'Raw & Living',
    'Slow Clay Braise':  'Clay-Braised',
  };

  const aliases = vegAliases[veg] || [veg];
  const vegName = aliases[Math.floor(Math.random() * aliases.length)];
  const mWord   = methodWords[method] || '';

  return `${mWord} ${vegName} with ${pro} on ${grain}`;
}


/* ═══════════════════════════════════════════════
   16. INGREDIENT BREAKDOWN HTML
   Summary rows shown in the reveal overlay
═══════════════════════════════════════════════ */
function buildBreakdown() {
  const catLabels = { veg: 'Vegetable', pro: 'Protein', grain: 'Grain', method: 'Method' };

  return Object.entries(picks)
    .filter(([, name]) => Boolean(name))
    .map(([cat, name]) => {
      const d = INGREDIENTS[name];
      return `
        <div class="rv-bk-row">
          <span class="rv-bk-emoji" aria-hidden="true">${d.emoji}</span>
          <div>
            <div class="rv-bk-name">${name}</div>
            <div class="rv-bk-detail">${catLabels[cat]} · ${d.water} · ${d.carbon}</div>
          </div>
          <span class="rv-bk-score" aria-label="Score ${d.score}">${d.score}</span>
        </div>`;
    })
    .join('');
}


/* ═══════════════════════════════════════════════
   17. RESET — clear everything, scroll to builder
═══════════════════════════════════════════════ */
function resetAll() {
  closeReveal();

  picks = { veg: null, pro: null, grain: null, method: null };

  document.querySelectorAll('.ing-card').forEach(c => c.classList.remove('sel'));
  ['veg', 'pro', 'grain', 'method'].forEach(cat => {
    clearPlateLayer(cat);
    updateMiniScores(cat, null);
  });
  checkRevealReady();
  closeSusPanel();

  setTimeout(() => {
    const builder = document.getElementById('meal-builder');
    if (builder) builder.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 480);
}


/* ═══════════════════════════════════════════════
   18. DOM READY — BOOTSTRAP EVERYTHING
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {

  /* Inject SVG gradient definition for score ring */
  injectScoreGradient();

  /* Libraries */
  initAOS();
  initGSAP();

  /* Ingredient card interactions */
  initCards();

  /* ── Button listeners ─────────────────────── */
  const $ = id => document.getElementById(id);

  $('sus-close').addEventListener('click', closeSusPanel);
  $('reveal-btn').addEventListener('click', openReveal);
  $('rv-close').addEventListener('click', closeReveal);
  $('rv-backdrop').addEventListener('click', closeReveal);
  $('rv-enjoy').addEventListener('click', closeReveal);
  $('rv-restart').addEventListener('click', resetAll);

  /* ESC closes whichever overlay is open */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const overlay = $('meal-reveal');
    if (overlay && !overlay.hasAttribute('hidden')) closeReveal();
    else closeSusPanel();
  });
});
