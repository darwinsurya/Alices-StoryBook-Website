/* WHITE RABBIT interactions — boot, Lenis, motes, pocket watch, grin fade, riddles, wipe. */
(() => {
  document.body.classList.add('js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);

  // ---------- boot: binding the book ----------
  const boot = document.getElementById('boot');
  document.body.classList.add('loading');
  const release = () => { boot?.classList.add('done'); document.body.classList.remove('loading'); };
  // binding shows once per visit — hopping between pages skips it
  let seen = false;
  try { seen = !!sessionStorage.getItem('wrp-seen'); } catch (e) {}
  try { if (!seen) sessionStorage.setItem('wrp-seen', '1'); } catch (e) {}
  if (seen) release();
  else try {
    const pct = document.getElementById('boot-pct');
    const bar = document.querySelector('.boot-bar i');
    const log = document.getElementById('boot-log');
    const lines = ['CHAPTER I ... FOUND', 'ENGRAVINGS ... 1865', 'TEA ... BREWING', 'OFF WITH ... DELAYS'];
    let p = 0, li = 0;
    var bootIv = setInterval(() => {
      p = Math.min(100, p + 5 + Math.random() * 10);
      if (pct) pct.textContent = Math.floor(p) + '%';
      if (bar) bar.style.transform = `scaleX(${p / 100})`;
      if (log && li < lines.length && p > (li + 1) * 22) { log.innerHTML += '<br>> ' + lines[li++]; }
      if (p >= 100) { clearInterval(bootIv); setTimeout(release, 350); }
    }, 130);
  } catch (e) { release(); }
  setTimeout(() => { try { clearInterval(bootIv); } catch (e) {} release(); }, 5000);
  addEventListener('load', () => setTimeout(release, 800));

  // ---------- Lenis: single driver ----------
  let lenis = null;
  try {
    if (window.Lenis && !reduced) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false, touchMultiplier: 1.4 });
      if (hasGSAP) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    }
  } catch (e) { lenis = null; }
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id.length < 2) return;
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(t, { offset: -70, duration: 1.2 }) : t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }));

  // ---------- masthead ----------
  const burger = document.getElementById('burger'), menu = document.getElementById('menu');
  const setMenu = (open) => {
    menu.hidden = !open;
    burger?.setAttribute('aria-expanded', String(open));
    if (lenis) { try { open ? lenis.stop() : lenis.start(); } catch (e) {} }
  };
  burger?.addEventListener('click', () => setMenu(menu.hidden));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false); });
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.top nav a').forEach(a => { if (a.getAttribute('href') === page) a.classList.add('active'); });

  /* pocket watch retired — the masthead now bears a static EST. 1865 stamp */

  // ---------- split + reveal + counters ----------
  document.querySelectorAll('[data-split]').forEach(el => {
    if (el.querySelector('.w')) return;
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w"><span>${w}</span></span>`).join(' ');
  });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = parseFloat(el.dataset.count || 0); cio.unobserve(el);
    if (reduced) { el.textContent = end; return; }
    const t0 = performance.now();
    (function step(t) { const k = Math.min(1, (t - t0) / 1300); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0);
  }), { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  // ---------- progress + parallax + cheshire fade ----------
  const prog = document.getElementById('progress');
  const pEls = [...document.querySelectorAll('[data-parallax]')];
  const grins = [...document.querySelectorAll('.fade-grin')];
  const smallScreen = matchMedia('(max-width: 700px)').matches;
  const useParallax = !reduced && !smallScreen;
  (function frame() {
    const y = window.scrollY || 0;
    const h = document.documentElement;
    const sp = y / Math.max(1, h.scrollHeight - innerHeight);
    if (prog) prog.style.transform = `scaleX(${sp})`;
    if (useParallax) for (const el of pEls) {
      const parent = el.parentElement;
      if (!parent) continue;
      const r = parent.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) continue;
      const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      el.style.transform = `translate3d(0,${(k * parseFloat(el.dataset.parallax || 12) * 2).toFixed(1)}px,0)`;
    }
    if (!reduced) for (const g of grins) {
      const r = g.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / (innerHeight * 0.6)));
      g.style.opacity = (1 - k * 0.88).toFixed(3);
    }
    requestAnimationFrame(frame);
  })();

  // ---------- GSAP choreography ----------
  if (hasGSAP && !reduced) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('[data-split]').forEach(el => {
      const spans = el.querySelectorAll('.w > span');
      if (!spans.length) return;
      gsap.fromTo(spans, { yPercent: 115 }, { yPercent: 0, stagger: 0.05, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    addEventListener('load', () => ScrollTrigger.refresh());
    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  // ---------- dust motes in the sunbeam ----------
  const cv = document.getElementById('motes');
  if (cv && !reduced) {
    const ctx = cv.getContext('2d');
    let W, H;
    const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
    size(); addEventListener('resize', size);
    const suits = ['♥', '♦', '♠', '♣'];
    const suitFan = document.body.classList.contains('suits'); // queen's page rains cards
    const ps = [];
    for (let i = 0; i < 70; i++) ps.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2 + 0.6, vy: -(Math.random() * 0.25 + 0.08),
      vx: (Math.random() - 0.5) * 0.2, ph: Math.random() * 7,
      suit: Math.random() < (suitFan ? 0.45 : 0.12) ? suits[i % 4] : null
    });
    let boost = 0, lastY = window.scrollY || 0;
    (function loop() {
      const y = window.scrollY || 0;
      boost = Math.min(5, boost * 0.94 + Math.abs(y - lastY) / 16); lastY = y;
      ctx.clearRect(0, 0, W, H);
      const now = performance.now();
      for (const p of ps) {
        p.x += p.vx + Math.sin((now / 2400) + p.ph) * 0.25;
        p.y += p.vy * (1 + boost);
        if (p.y < -14) { p.y = H + 12; p.x = Math.random() * W; }
        if (p.x < -14) p.x = W + 12; if (p.x > W + 14) p.x = -12;
        const a = 0.12 + 0.14 * Math.abs(Math.sin(now / 900 + p.ph));
        if (p.suit) {
          ctx.font = '13px Georgia'; ctx.fillStyle = `rgba(123,30,30,${(a + 0.15).toFixed(3)})`;
          ctx.fillText(p.suit, p.x, p.y);
        } else {
          ctx.beginPath(); ctx.fillStyle = `rgba(90,76,58,${a.toFixed(3)})`;
          ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
        }
      }
      requestAnimationFrame(loop);
    })();
  }

  // ---------- riddles: tap to confess (button semantics) ----------
  document.querySelectorAll('.riddle').forEach(el => {
    el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0'); el.setAttribute('aria-expanded', 'false');
    const flip = () => { el.classList.toggle('open'); el.setAttribute('aria-expanded', String(el.classList.contains('open'))); };
    el.addEventListener('click', flip);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  });

  // ---------- page-turn wipe ----------
  const wipe = document.getElementById('wipe');
  document.querySelectorAll('a[href$=".html"]').forEach(a => a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    if (!wipe || reduced) { location.href = href; return; }
    try { lenis?.stop(); } catch (e) {}
    wipe.classList.add('go'); setTimeout(() => { location.href = href; }, 280);
  }));
})();

/* wonder pass: vials, quiz, quoter, pour, mirror (second scope, same guards) */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- DRINK ME / EAT ME ----------
  const sip = document.getElementById('sip'), eat = document.getElementById('eat');
  const setVial = (mode) => {
    document.body.classList.remove('sip', 'big');
    sip?.classList.remove('on'); eat?.classList.remove('on');
    if (mode === 'sip' && !document.body.dataset.sipping) { document.body.classList.add('sip'); document.body.dataset.sipping = '1'; sip?.classList.add('on'); }
    else if (mode === 'big' && !document.body.dataset.bigging) { document.body.classList.add('big'); document.body.dataset.bigging = '1'; eat?.classList.add('on'); }
    else { delete document.body.dataset.sipping; delete document.body.dataset.bigging; }
  };
  sip?.addEventListener('click', () => setVial('sip'));
  eat?.addEventListener('click', () => setVial('big'));

  // ---------- WHICH WONDER ARE YOU? ----------
  const quiz = document.getElementById('quiz');
  if (quiz) {
    const questions = [
      { q: 'It is always tea-time. You…', opts: ['Demand wine anyway', 'Shout for somebody’s head', 'Fade out politely'] },
      { q: 'A Caterpillar asks who YOU are. You…', opts: ['Explain at length', 'Ask for a riddle instead', 'Check your watch'] },
      { q: 'Choose a talent:', opts: ['Growing and shrinking', 'Grinning without a cat', 'Shouting first'] }
    ];
    const finals = [
      { t: 'You are ALICE.', d: 'Literal, brave, and always asking the good questions. Mind the bottles.' },
      { t: 'You are the HATTER.', d: 'Brilliant, stuck at six o’clock, and never washing the cups.' },
      { t: 'You are the CHESHIRE CAT.', d: 'Half here, all grin, and right about everybody being mad.' }
    ];
    let qi = 0; const tally = [0, 0, 0];
    const verdict = quiz.querySelector('.verdictline');
    const ask = () => {
      if (qi >= questions.length) {
        const top = tally.indexOf(Math.max(...tally));
        const f = finals[top] ?? { t: 'You are the WHITE RABBIT.', d: 'Late to decide — run!' };
        quiz.querySelector('h3').textContent = f.t;
        quiz.querySelector('.opts').innerHTML = '';
        verdict.innerHTML = f.d + ' <a href="characters.html">Meet yourself →</a>';
        return;
      }
      const Q = questions[qi];
      quiz.querySelector('h3').textContent = `Q${qi + 1} · ${Q.q}`;
      const box = quiz.querySelector('.opts');
      box.innerHTML = '';
      Q.opts.forEach((o, i) => {
        const b = document.createElement('button');
        b.className = 'opt'; b.textContent = o;
        b.addEventListener('click', () => { tally[i]++; qi++; ask(); });
        box.appendChild(b);
      });
    };
    ask();
  }

  // ---------- ASK THE CAT ----------
  const says = [
    '“We’re all mad here. I’m mad. You’re mad.”',
    '“That depends a good deal on where you want to get to.”',
    '“Would you tell me, please, which way I ought to go from here?”',
    '“Oh, you can’t help that: we’re all mad here.”'
  ];
  let si = 0;
  document.querySelectorAll('[data-ask]').forEach(btn => btn.addEventListener('click', () => {
    const out = document.querySelector(btn.dataset.ask);
    if (!out) return;
    si = (si + 1) % says.length;
    out.textContent = says[si];
  }));

  // ---------- POUR THE TEA ----------
  document.querySelectorAll('[data-pour]').forEach(btn => btn.addEventListener('click', () => {
    const cup = document.querySelector(btn.dataset.pour);
    cup?.classList.toggle('poured');
    btn.textContent = cup?.classList.contains('poured') ? 'NO ROOM! NO ROOM!' : 'POUR THE TEA';
  }));

  // ---------- HOLD IT TO THE GLASS ----------
  if (!reduced) document.querySelectorAll('.mirror').forEach(m => m.addEventListener('click', () => m.classList.toggle('open')));
  else document.querySelectorAll('.mirror').forEach(m => m.classList.add('open'));
})();

/* reading room: text size + bookmark (guarded scope) */
(() => {
  // ---------- reading room: text size + bookmark ----------
  const reading = document.querySelector('.reading');
  if (reading) {
    let fs = 0;
    try { fs = parseInt(localStorage.getItem('wrp-fs') || '0', 10) || 0; } catch (e) {}
    fs = Math.max(-1, Math.min(1, fs));
    const applyFs = () => {
      reading.classList.remove('smaller', 'bigger');
      if (fs < 0) reading.classList.add('smaller');
      if (fs > 0) reading.classList.add('bigger');
      try { localStorage.setItem('wrp-fs', String(fs)); } catch (e) {}
    };
    applyFs();
    document.getElementById('t-dec')?.addEventListener('click', () => { fs = Math.max(-1, fs - 1); applyFs(); });
    document.getElementById('t-inc')?.addEventListener('click', () => { fs = Math.min(1, fs + 1); applyFs(); });
    const resume = document.getElementById('resume');
    let saved = 0;
    try { saved = parseInt(localStorage.getItem('wrp-mark') || '0', 10) || 0; } catch (e) {}
    if (resume && saved > 400) {
      resume.hidden = false;
      resume.textContent = `RESUME · PAGE ${Math.floor(saved / 800) + 1}`;
      resume.addEventListener('click', () => window.scrollTo({ top: saved, behavior: 'smooth' }));
    }
    let tick = false;
    addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => {
        tick = false;
        try { localStorage.setItem('wrp-mark', String(window.scrollY || 0)); } catch (e) {}
      });
    }, { passive: true });
  }
})();
