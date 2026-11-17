/* We Clinic — protótipo de redesign */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;
  const hasGsap = typeof gsap !== 'undefined';
  document.body.classList.add('loading');

  /* ---------- split text ---------- */
  function splitWords(el) {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const i = document.createElement('span'); i.textContent = part;
            w.appendChild(i); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    return el.querySelectorAll('.w > span');
  }
  document.querySelectorAll('.split').forEach(splitWords);

  /* manifesto words */
  const man = document.getElementById('manifesto');
  if (man) man.innerHTML = man.textContent.trim().split(/\s+/).map((w) => `<span class="mw">${w}</span>`).join(' ');

  /* ---------- particles (hero) ---------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const label = document.getElementById('shapeLabel');
  const SVGNS = 'http://www.w3.org/2000/svg';
  const starPath = (() => { let d = ''; for (let i = 0; i < 10; i++) { const r = i % 2 ? 42 : 100; const a = -Math.PI / 2 + i * Math.PI / 5; d += (i ? 'L' : 'M') + (100 + r * Math.cos(a)).toFixed(1) + ' ' + (125 + r * Math.sin(a)).toFixed(1); } return d + 'Z'; })();
  const SHAPES = [
    { name: 'sorriso completo', d: 'M100 20C60 5 20 20 22 70c2 40 23 55 28 90 5 40 8 70 22 72 16 2 16-47 28-62 12 15 12 64 28 62 14-2 17-32 22-72 5-35 26-50 28-90 2-50-38-65-78-50Z' },
    { name: 'implante unitário', d: 'M100 10C75 1 52 10 54 36c1 17 8 30 13 46 5 15 15 20 33 20s28-5 33-20c5-16 12-29 13-46 2-26-21-35-46-26Z M86 108h28l4 36H82Z M80 150h40l-4 70q-16 22-32 0Z' },
    { name: 'nota 5,0 no google', d: starPath },
    { name: 'harmonização', d: 'M8 118 Q40 78 72 92 Q88 98 100 88 Q112 98 128 92 Q160 78 192 118 Q150 176 100 178 Q50 176 8 118Z' },
  ];
  const offC = document.createElement('canvas'); offC.width = 200; offC.height = 240; const off = offC.getContext('2d');
  const svgTmp = document.createElementNS(SVGNS, 'svg');
  svgTmp.style.cssText = 'position:absolute;width:0;height:0;visibility:hidden';
  document.body.appendChild(svgTmp);

  function samplePoints(d, n) {
    const pts = [];
    const p2 = new Path2D(d);
    const nOutline = Math.floor(n * 0.55);
    d.split(/(?=M)/).forEach((sub, _, arr) => {
      const el = document.createElementNS(SVGNS, 'path'); el.setAttribute('d', sub); svgTmp.appendChild(el);
      const L = el.getTotalLength(); const k = Math.round(nOutline / arr.length);
      for (let i = 0; i < k; i++) { const p = el.getPointAtLength((i / k) * L); pts.push([p.x + (Math.random() - .5) * 2, p.y + (Math.random() - .5) * 2]); }
      el.remove();
    });
    let guard = 0;
    while (pts.length < n && guard++ < n * 40) {
      const x = Math.random() * 200, y = Math.random() * 240;
      if (off.isPointInPath(p2, x, y)) pts.push([x, y]);
    }
    while (pts.length < n) pts.push(pts[Math.floor(Math.random() * pts.length)]);
    for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
    return pts;
  }

  let W, H, DPR, N, parts = [], shapePts = [], shapeIdx = 0, cx, cy, sc;
  const mouse = { x: -9999, y: -9999 };
  const COLORS = ['#c1774c', '#e2aa8a', '#f2e3d5', '#d2b24f', '#f2e3d5'];

  function layout() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const mobile = W < 860;
    const sh = mobile ? Math.min(H * 0.38, W * 0.75) : Math.min(H * 0.7, W * 0.42);
    sc = sh / 240;
    cx = mobile ? W * 0.5 : W * 0.73;
    cy = mobile ? H * 0.3 : H * 0.52;
  }
  function initParticles() {
    layout();
    N = W < 860 ? 900 : 1900;
    shapePts = SHAPES.map((s) => samplePoints(s.d, N));
    parts = Array.from({ length: N }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0,
      s: Math.random() * 1.6 + 0.6, c: COLORS[i % COLORS.length], a: Math.random() * 0.6 + 0.4, ph: Math.random() * 6.28,
    }));
  }
  function nextShape() {
    shapeIdx = (shapeIdx + 1) % SHAPES.length;
    parts.forEach((p) => { p.vx += (Math.random() - .5) * 14; p.vy += (Math.random() - .5) * 14; });
    if (label) { label.style.opacity = 0; setTimeout(() => { label.textContent = SHAPES[shapeIdx].name; label.style.opacity = 1; }, 300); }
  }
  if (label) label.style.transition = 'opacity .3s';
  let heroVisible = true, t = 0, scrollFade = 1;
  function frame() {
    requestAnimationFrame(frame);
    if (!heroVisible) return;
    t += 0.016;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    const pts = shapePts[shapeIdx];
    const breathe = 1 + Math.sin(t * 1.2) * 0.012;
    for (let i = 0; i < N; i++) {
      const p = parts[i], q = pts[i];
      const tx = cx + (q[0] - 100) * sc * breathe + Math.sin(t * 2 + p.ph) * 1.2;
      const ty = cy + (q[1] - 120) * sc * breathe + Math.cos(t * 1.7 + p.ph) * 1.2;
      p.vx += (tx - p.x) * 0.018; p.vy += (ty - p.y) * 0.018;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 12000) { const f = (12000 - d2) / 12000 * 2.4; const d = Math.sqrt(d2) || 1; p.vx += dx / d * f; p.vy += dy / d * f; }
      p.vx *= 0.86; p.vy *= 0.86; p.x += p.vx; p.y += p.vy;
      ctx.globalAlpha = p.a * scrollFade;
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.s, p.s);
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
  initParticles();
  if (reduce) {
    parts.forEach((p, i) => { const q = shapePts[0][i]; p.x = cx + (q[0] - 100) * sc; p.y = cy + (q[1] - 120) * sc; });
    ctx.globalCompositeOperation = 'lighter';
    parts.forEach((p) => { ctx.globalAlpha = p.a; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.s, p.s); });
  } else {
    frame();
    setInterval(() => { if (heroVisible && !document.hidden) nextShape(); }, 3800);
  }
  let rT; addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { const old = W; layout(); if (Math.abs(old - W) > 120) initParticles(); }, 200); });
  const hero = document.querySelector('.hero');
  hero.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);

  /* ---------- menu ---------- */
  const burger = document.getElementById('burger');
  burger.addEventListener('click', () => document.body.classList.toggle('menu-open'));
  document.querySelectorAll('.menu a').forEach((a) => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  /* ---------- no GSAP fallback ---------- */
  const loader = document.getElementById('loader');
  if (!hasGsap) { loader.remove(); document.body.classList.remove('loading'); document.querySelectorAll('.mw').forEach((w) => (w.style.color = 'inherit')); return; }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  let lenis;
  if (!reduce && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const tgt = document.querySelector(id); if (!tgt) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(tgt, { offset: -20 }) : tgt.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------- nav hide ---------- */
  const nav = document.getElementById('nav'); let lastY = 0;
  ScrollTrigger.create({ onUpdate: (s) => { const y = s.scroll(); nav.classList.toggle('is-hidden', y > lastY && y > 300 && !document.body.classList.contains('menu-open')); lastY = y; } });
  ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => { scrollFade = 1 - s.progress * 0.9; } });

  /* ---------- loader + hero intro ---------- */
  const countEl = document.getElementById('loaderCount');
  const heroWords = document.querySelectorAll('.hero__title .w > span');
  gsap.set(heroWords, { yPercent: 110 });
  gsap.set('.hero .reveal-up', { y: 30, opacity: 0 });
  const cnt = { v: 0 };
  const intro = gsap.timeline();
  intro.to(cnt, { v: 100, duration: reduce ? 0.1 : 1.7, ease: 'power2.inOut', onUpdate: () => (countEl.textContent = Math.round(cnt.v)) })
    .to('.loader__mark', { scale: 0.6, opacity: 0, duration: 0.5, ease: 'power3.in' })
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.15')
    .add(() => { loader.remove(); document.body.classList.remove('loading'); lenis && lenis.start(); })
    .to(heroWords, { yPercent: 0, duration: 1.2, stagger: 0.05, ease: 'expo.out' }, '-=0.5')
    .to('.hero .reveal-up', { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'expo.out' }, '-=1');
  gsap.set(loader, { clipPath: 'inset(0 0 0% 0)' });

  /* ---------- split reveals ---------- */
  document.querySelectorAll('.split:not(.hero__title)').forEach((el) => {
    gsap.from(el.querySelectorAll('.w > span'), { yPercent: 110, duration: 1.1, stagger: 0.04, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  /* ---------- manifesto fill ---------- */
  gsap.to('.mw', { color: '#f2e3d5', stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 70%', end: 'bottom 60%', scrub: true } });

  /* ---------- marquee skew by velocity ---------- */
  const mq = document.querySelector('.marquee');
  ScrollTrigger.create({ onUpdate: (s) => { const v = gsap.utils.clamp(-8, 8, s.getVelocity() / 300); gsap.to(mq, { skewX: -v, duration: 0.4, overwrite: true }); } });

  const mm = gsap.matchMedia();

  /* ---------- cases horizontal ---------- */
  mm.add('(min-width: 861px)', () => {
    const track = document.getElementById('casesTrack');
    const dist = () => track.scrollWidth - innerWidth;
    const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.cases', start: 'top top', end: () => '+=' + dist(), scrub: 1, pin: true, invalidateOnRefresh: true } });
    track.querySelectorAll('.case').forEach((c, i) => {
      gsap.fromTo(c.querySelector('img'), { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      gsap.from(c, { y: i % 2 ? 80 : -40, rotate: i % 2 ? 2 : -2, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left right', end: 'center center', scrub: true } });
    });
  });
  mm.add('(max-width: 860px)', () => {
    gsap.utils.toArray('.case').forEach((c) => gsap.from(c, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 88%' } }));
  });

  /* ---------- implant exploded view ---------- */
  const steps = document.querySelectorAll('.implant__steps li');
  const setStep = (p) => steps.forEach((li, i) => li.classList.toggle('on', p > 0.18 + i * 0.22));
  const buildImplant = (st) => {
    const tl = gsap.timeline({ scrollTrigger: st });
    tl.fromTo('#implantSvg', { rotate: -10, scale: 0.85 }, { rotate: 0, scale: 1, duration: 1, ease: 'none' }, 0)
      .to('.ip-crown, .ip-l0', { y: -120, duration: 1, ease: 'power2.inOut' }, 0.15)
      .to('.ip-abut, .ip-l1', { y: -45, duration: 1, ease: 'power2.inOut' }, 0.25)
      .to('.ip-screw, .ip-l2', { y: 60, duration: 1, ease: 'power2.inOut' }, 0.15)
      .to('.ip-tissue', { opacity: 0.25, duration: 0.6 }, 0.2)
      .to('.ip-shadow', { attr: { ry: 30 }, opacity: 0.4, y: 60, duration: 1 }, 0.15)
      .to('.ip-l0', { opacity: 1, duration: 0.25 }, 0.55)
      .to('.ip-l1', { opacity: 1, duration: 0.25 }, 0.75)
      .to('.ip-l2', { opacity: 1, duration: 0.25 }, 0.95)
      .to({}, { duration: 0.3 });
    return tl;
  };
  mm.add('(min-width: 861px)', () => buildImplant({ trigger: '.implant', start: 'top top', end: 'bottom bottom', scrub: 1, onUpdate: (s) => setStep(s.progress) }));
  mm.add('(max-width: 860px)', () => buildImplant({ trigger: '.implant__stage', start: 'top 70%', end: 'bottom 20%', scrub: 1, onUpdate: (s) => setStep(s.progress) }));
  gsap.to('.implant__ring', { rotate: 120, ease: 'none', scrollTrigger: { trigger: '.implant', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---------- treatment cards ---------- */
  gsap.from('.tcard', { y: 80, opacity: 0, duration: 1.1, stagger: { each: 0.08, grid: 'auto', from: 'start' }, ease: 'expo.out', scrollTrigger: { trigger: '.treat__grid', start: 'top 82%' } });
  gsap.fromTo('.tcard__icon svg *', { strokeDasharray: 300, strokeDashoffset: 300 }, { strokeDashoffset: 0, duration: 2, stagger: 0.02, ease: 'power2.out', scrollTrigger: { trigger: '.treat__grid', start: 'top 75%' } });
  if (!isTouch) document.querySelectorAll('.tcard').forEach((c) => {
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
      gsap.to(c, { rotateY: (x - 0.5) * 10, rotateX: (0.5 - y) * 10, transformPerspective: 800, duration: 0.5, ease: 'power2.out' });
    });
    c.addEventListener('pointerleave', () => gsap.to(c, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1,.5)' }));
  });

  /* ---------- counters ---------- */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', o = { v: 0 };
    gsap.to(o, { v: end, duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' }, onUpdate: () => (el.textContent = pre + Math.round(o.v).toLocaleString('pt-BR') + suf) });
  });

  /* ---------- team ---------- */
  gsap.from('.doc', { y: 100, opacity: 0, rotate: () => gsap.utils.random(-3, 3), duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: '.team__grid', start: 'top 80%' } });

  /* ---------- clinic ---------- */
  gsap.to('.clinic__mask', { clipPath: 'inset(0% 0 0 0 round 300px 300px 28px 28px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.clinic', start: 'top 70%' } });
  gsap.fromTo('.clinic__mask img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.clinic', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.clinic__list li', { y: 20, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: '.clinic__list', start: 'top 90%' } });

  /* ---------- reviews ---------- */
  gsap.from('.reviews__big', { scale: 0.4, opacity: 0, duration: 1.4, ease: 'elastic.out(1,.6)', scrollTrigger: { trigger: '.reviews', start: 'top 75%' } });

  /* ---------- cta + footer ---------- */
  gsap.from('.cta__big', { scale: 0.7, opacity: 0, duration: 1.2, ease: 'elastic.out(1,.6)', scrollTrigger: { trigger: '.cta__big', start: 'top 90%' } });
  gsap.from('.local > *', { y: 60, opacity: 0, stagger: 0.15, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.local', start: 'top 85%' } });
  gsap.fromTo('.footer__giant', { xPercent: 12 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  /* ---------- cursor + magnetic ---------- */
  if (!isTouch) {
    const cur = document.getElementById('cursor'), dot = cur.querySelector('span');
    const xTo = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' }), yTo = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
    addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); });
    document.querySelectorAll('a, button, .case, .doc').forEach((el) => {
      el.addEventListener('pointerenter', () => {
        if (el.dataset.cursor) { cur.classList.add('is-big'); dot.textContent = el.dataset.cursor; }
        else if (el.classList.contains('case')) { cur.classList.add('is-big'); dot.textContent = 'ver caso'; }
        else cur.classList.add('is-hover');
      });
      el.addEventListener('pointerleave', () => { cur.classList.remove('is-big', 'is-hover'); dot.textContent = ''; });
    });
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.4, ease: 'power3' }); });
      el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,.4)' }));
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
