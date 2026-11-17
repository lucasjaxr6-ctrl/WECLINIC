/* We Clinic — protótipo B2C */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none)').matches;
  const WA = '5521997274701';
  document.body.classList.add('loading');

  /* ---------- WhatsApp links ---------- */
  const setWa = (a) => { a.href = `https://wa.me/${WA}?text=${encodeURIComponent(a.dataset.wa || 'Olá! Vim pelo site 😊')}`; a.target = '_blank'; a.rel = 'noopener'; };
  document.querySelectorAll('.wa-link').forEach(setWa);

  /* ---------- confetti ---------- */
  const cv = document.getElementById('confetti'), cx = cv.getContext('2d');
  let bits = [], running = false;
  const fit = () => { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; cx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
  fit(); addEventListener('resize', fit);
  const COLS = ['#c1774c', '#ffc857', '#ffd3b8', '#3a2a24', '#25d366', '#f6c4b4'];
  function burst(x, y) {
    if (reduce) return;
    for (let i = 0; i < 90; i++) {
      const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9;
      bits.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, r: Math.random() * 6.28, vr: (Math.random() - .5) * .4, w: 6 + Math.random() * 6, h: 4 + Math.random() * 4, c: COLS[i % COLS.length], life: 1 });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function tick() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    bits.forEach((b) => { b.vy += .32; b.vx *= .985; b.x += b.vx; b.y += b.vy; b.r += b.vr; b.life -= .008;
      cx.save(); cx.globalAlpha = Math.max(b.life, 0); cx.translate(b.x, b.y); cx.rotate(b.r); cx.fillStyle = b.c; cx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); cx.restore(); });
    bits = bits.filter((b) => b.life > 0 && b.y < innerHeight + 40);
    if (bits.length) requestAnimationFrame(tick); else { running = false; cx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  document.querySelectorAll('.confetti').forEach((el) => el.addEventListener('click', (e) => burst(e.clientX, e.clientY)));

  /* ---------- quiz ---------- */
  const Q = {
    implante: { tag: 'Implante dentário', t: 'Um dente fixo de novo, com cara de dente seu.', p: 'O implante substitui a raiz e recebe uma coroa sob medida, na cor dos seus dentes. Nada de “janelinha” no sorriso nem prótese que solta.', who: 'Quem cuida: Dr. Guilherme Aguiar · Prótese e Implantodontia', img: 'equipe-guilherme', btn: 'Quero saber do meu implante', wa: 'Olá! Perdi um dente e quero saber sobre implante 🦷' },
    clareamento: { tag: 'Clareamento dental', t: 'Dentes mais brancos, com segurança.', p: 'Fazemos clareamento no consultório ou com o kit caseiro, sempre com acompanhamento pra você ter um resultado bonito e sem susto.', who: 'Quem cuida: equipe de dentística da We', img: 'caso-clareamento', btn: 'Quero clarear meu sorriso', wa: 'Olá! Quero saber sobre clareamento ✨' },
    alinhador: { tag: 'Alinhadores invisíveis', t: 'Dentes alinhados sem ninguém perceber.', p: 'Placas transparentes, removíveis e feitas pro seu sorriso. Dá pra comer de tudo e ninguém vê “ferrinho”.', who: 'Quem cuida: Dra. Lia Araujo · Ortodontia, habilitada em alinhadores', img: 'equipe-lia', btn: 'Quero alinhar meus dentes', wa: 'Olá! Quero saber sobre alinhadores invisíveis 😁' },
    protese: { tag: 'Prótese, overdenture e reabilitação', t: 'Mastigar, falar e sorrir com firmeza.', p: 'Da prótese nova até a overdenture presa em implantes: devolvemos função e estética pra você comer o que gosta sem medo de soltar.', who: 'Quem cuida: Dr. Guilherme Aguiar · Prótese Dentária', img: 'ba-reabilitacao-depois', btn: 'Quero melhorar minha prótese', wa: 'Olá! Preciso trocar/fazer prótese e quero uma avaliação 🙌' },
    labios: { tag: 'Harmonização', t: 'Realçar o que já é seu, com naturalidade.', p: 'Preenchimento labial, suavização do bigode chinês e toxina botulínica, sempre buscando um resultado leve e harmônico.', who: 'Quem cuida: equipe de harmonização · Dra. Karina Fonseca, farmácia estética', img: 'ba-labial-depois', btn: 'Quero saber de harmonização', wa: 'Olá! Quero saber sobre harmonização / preenchimento 💋' },
    medo: { tag: 'Atendimento acolhedor', t: 'Medo de dentista? Você está em boas mãos.', p: 'A gente explica tudo antes, respeita o seu tempo e faz pausas quando você precisar. Muita gente chega nervosa e sai rindo.', who: '“Cheguei muito nervoso e me trataram da melhor forma possível” · Renato, no Google', img: 'clinica-recepcao', btn: 'Quero conversar primeiro', wa: 'Oi! Tenho medo de dentista, mas quero marcar uma avaliação 😅' },
    kids: { tag: 'Odontopediatria', t: 'Dentista pode ser divertido. Sério!', p: 'Consultas leves e acolhedoras pra criança criar uma relação boa com o cuidado dos dentes desde cedo.', who: 'Ambiente pensado pros pequenos 🧸', img: 'caso-odontopediatria', btn: 'Quero agendar pro meu filho(a)', wa: 'Olá! Quero agendar uma consulta para o meu filho(a) 🧸' },
  };
  const exts = { 'caso-clareamento': 'webp' };
  const $ = (id) => document.getElementById(id);
  const chips = document.querySelectorAll('.chip');
  function setQuiz(k) {
    const d = Q[k];
    const apply = () => {
      $('qrTag').textContent = d.tag; $('qrTitle').textContent = d.t; $('qrText').textContent = d.p; $('qrWho').textContent = d.who;
      $('qrImg').src = `assets/${d.img}.${exts[d.img] || 'webp'}`; $('qrBtnTxt').textContent = d.btn; $('qrBtn').dataset.wa = d.wa; setWa($('qrBtn'));
    };
    if (typeof gsap === 'undefined' || reduce) { apply(); return; }
    gsap.timeline()
      .to('#quizResult .qr__body > *, .qr__img', { y: 20, opacity: 0, duration: .2, stagger: .02, ease: 'power2.in' })
      .add(apply)
      .fromTo('.qr__img', { scale: .6, rotate: -20, opacity: 0, y: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: .7, ease: 'back.out(2)' })
      .fromTo('#quizResult .qr__body > *', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .06, ease: 'back.out(1.6)' }, '<.05');
  }
  chips.forEach((c) => c.addEventListener('click', () => { chips.forEach((x) => x.classList.remove('is-active')); c.classList.add('is-active'); setQuiz(c.dataset.k); }));

  /* ---------- before / after ---------- */
  const cmp = $('compare'), CASES = ['reabilitacao', 'implante', 'labial', 'bigode-chines'];
  let pos = 50, dragging = false, touched = false;
  const setPos = (p) => { pos = Math.max(0, Math.min(100, p)); cmp.style.setProperty('--p', pos + '%'); };
  const fromEvent = (e) => { const r = cmp.getBoundingClientRect(); setPos(((e.clientX - r.left) / r.width) * 100); };
  cmp.addEventListener('pointerdown', (e) => { dragging = true; cmp.setPointerCapture(e.pointerId); fromEvent(e); if (!touched) { touched = true; cmp.querySelector('.note--ba').style.opacity = 0; } });
  cmp.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); else if (!touch && touched) fromEvent(e); });
  cmp.addEventListener('pointerup', () => (dragging = false));
  document.querySelectorAll('#baTabs button').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('#baTabs button').forEach((x) => x.classList.remove('is-active')); b.classList.add('is-active');
    const n = CASES[+b.dataset.i];
    const swap = () => { $('cmpBefore').src = `assets/ba-${n}-antes.webp`; $('cmpAfter').src = `assets/ba-${n}-depois.webp`; };
    if (typeof gsap === 'undefined') return swap();
    gsap.timeline().to(cmp, { opacity: 0, scale: .97, duration: .2 }).add(swap).to(cmp, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.6)' })
      .fromTo({ v: 15 }, { v: 15 }, { v: 50, duration: 1, ease: 'power3.out', onUpdate() { setPos(this.targets()[0].v); } });
  }));
  const fitCmp = () => { const im = $('cmpAfter'); if (!im.naturalWidth) return; const ar = im.naturalWidth / im.naturalHeight; cmp.style.aspectRatio = ar; cmp.style.maxWidth = `min(100%, calc(72vh * ${ar.toFixed(3)}))`; };
  $('cmpAfter').addEventListener('load', fitCmp); fitCmp();
  setPos(50);

  /* ---------- no GSAP fallback ---------- */
  const loader = $('loader');
  if (typeof gsap === 'undefined') { loader.remove(); document.body.classList.remove('loading'); document.querySelectorAll('.hl2').forEach((h) => h.classList.add('on')); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  let lenis;
  if (!reduce && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  document.querySelectorAll('a[href^="#"]:not(.wa-link)').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href'); if (id.length < 2) return; const t = document.querySelector(id); if (!t) return;
    e.preventDefault(); lenis ? lenis.scrollTo(t, { offset: -90 }) : t.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------- nav ---------- */
  const nav = $('nav'); let lastY = 0;
  ScrollTrigger.create({ onUpdate: (s) => { const y = s.scroll(); nav.classList.toggle('is-hidden', y > lastY && y > 500); lastY = y; } });

  /* ---------- split titles ---------- */
  document.querySelectorAll('.split').forEach((el) => {
    const walk = (node) => [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((p) => { if (!p) return; if (/^\s+$/.test(p)) return f.appendChild(document.createTextNode(' ')); const w = document.createElement('span'); w.className = 'w'; const i = document.createElement('span'); i.textContent = p; w.appendChild(i); f.appendChild(w); });
        n.replaceWith(f);
      } else if (n.nodeType === 1 && !n.classList.contains('hl2')) walk(n);
      else if (n.nodeType === 1) { n.classList.add('w-hl'); }
    });
    walk(el);
    gsap.from(el.querySelectorAll('.w > span, .w-hl'), { yPercent: 110, opacity: 0, duration: .9, stagger: .05, ease: 'back.out(1.4)', scrollTrigger: { trigger: el, start: 'top 85%' } });
    el.querySelectorAll('.hl2').forEach((h) => ScrollTrigger.create({ trigger: el, start: 'top 75%', once: true, onEnter: () => h.classList.add('on') }));
  });
  document.querySelectorAll('.w-hl').forEach((h) => { h.style.display = 'inline-block'; });

  /* ---------- loader + hero intro ---------- */
  gsap.set('.hero__title .line > span', { yPercent: 110 });
  gsap.set('.hero .reveal', { y: 30, opacity: 0 });
  gsap.set('.hero__art .blob, .hero__art .photo, .hero__art .sticker, .hero__art .note, .hero__art .spark', { scale: 0, opacity: 0 });
  const intro = gsap.timeline({ delay: reduce ? 0 : 1.1 });
  intro.to(loader, { yPercent: -100, duration: .8, ease: 'expo.inOut' })
    .add(() => { loader.remove(); document.body.classList.remove('loading'); lenis && lenis.start(); })
    .to('.hero__title .line > span', { yPercent: 0, duration: 1, stagger: .09, ease: 'back.out(1.5)' }, '-=.3')
    .to('.scribble path', { strokeDashoffset: 0, duration: .8, ease: 'power2.inOut' }, '-=.3')
    .to('.hero .reveal', { y: 0, opacity: 1, duration: .8, stagger: .1, ease: 'back.out(1.6)' }, '-=1')
    .to('.hero__art .blob', { scale: 1, opacity: 1, duration: 1.1, stagger: .1, ease: 'elastic.out(1,.6)' }, '-=1.2')
    .to('.hero__art .photo', { scale: 1, opacity: 1, duration: .9, stagger: .12, ease: 'back.out(1.8)' }, '-=.9')
    .to('.hero__art .sticker, .hero__art .note, .hero__art .spark', { scale: 1, opacity: 1, duration: .7, stagger: .08, ease: 'back.out(3)' }, '-=.5');

  /* hero parallax + floating */
  const depthEls = document.querySelectorAll('.hero__art [data-depth]');
  depthEls.forEach((el, i) => gsap.to(el, { y: '+=14', duration: 2.4 + i * .3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * .2 }));
  if (!touch) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      depthEls.forEach((el) => gsap.to(el, { x: -nx * el.dataset.depth, rotationY: nx * 8, duration: .8, ease: 'power3.out', overwrite: 'auto' }));
    });
  }
  gsap.to('.hero__art', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* band velocity skew */
  const band = document.querySelector('.band');
  ScrollTrigger.create({ onUpdate: (s) => gsap.to(band, { skewX: gsap.utils.clamp(-10, 10, s.getVelocity() / -250), duration: .4, overwrite: true }) });

  /* quiz entrance */
  gsap.from('.chip', { y: 40, opacity: 0, scale: .8, duration: .7, stagger: .06, ease: 'back.out(2.2)', scrollTrigger: { trigger: '.quiz__chips', start: 'top 85%' } });
  gsap.from('.quiz__result', { y: 80, rotate: 2, opacity: 0, duration: 1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.quiz__result', start: 'top 85%' } });

  /* before/after intro sweep */
  ScrollTrigger.create({ trigger: cmp, start: 'top 70%', once: true, onEnter: () => {
    const o = { v: 50 };
    gsap.timeline().to(o, { v: 85, duration: .8, ease: 'power2.inOut', onUpdate: () => setPos(o.v) }).to(o, { v: 15, duration: 1.1, ease: 'power2.inOut', onUpdate: () => setPos(o.v) }).to(o, { v: 50, duration: .8, ease: 'power2.out', onUpdate: () => setPos(o.v) });
  } });
  gsap.from('.ba__card', { y: 80, rotate: (i) => [-4, 3, -2][i], opacity: 0, duration: .9, stagger: .1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.ba__more', start: 'top 88%' } });

  /* chat sequence */
  const msgs = document.querySelectorAll('#chat .msg');
  gsap.set(msgs, { opacity: 0, y: 16, scale: .9 });
  ScrollTrigger.create({ trigger: '.phone', start: 'top 75%', once: true, onEnter: () => {
    gsap.to(msgs, { opacity: 1, y: 0, scale: 1, duration: .45, stagger: .7, ease: 'back.out(2)', transformOrigin: (i, el) => (el.classList.contains('msg--me') ? 'right bottom' : 'left bottom') });
  } });
  gsap.from('.phone', { y: 120, rotate: 10, duration: 1.2, ease: 'back.out(1.3)', scrollTrigger: { trigger: '.phone', start: 'top 95%' } });
  gsap.from('.fear__list li', { x: -40, opacity: 0, duration: .6, stagger: .08, ease: 'back.out(2)', scrollTrigger: { trigger: '.fear__list', start: 'top 88%' } });
  gsap.from('.bigquote', { scale: .8, opacity: 0, duration: .8, ease: 'back.out(2)', scrollTrigger: { trigger: '.bigquote', start: 'top 88%' } });

  /* treatment cards */
  gsap.fromTo('.tc', { y: 90, rotate: () => gsap.utils.random(-6, 6), opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: .9, stagger: .07, ease: 'back.out(1.7)', clearProps: 'transform', scrollTrigger: { trigger: '.treat__grid', start: 'top 85%' } });

  /* team row scroll-scrub */
  const row = $('teamRow');
  gsap.fromTo(row, { x: () => innerWidth * .15 }, { x: () => -(row.scrollWidth - innerWidth * .85), ease: 'none', scrollTrigger: { trigger: '.team', start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true } });
  gsap.fromTo('.mate', { scale: 0, rotate: -20 }, { scale: 1, rotate: 0, duration: .9, stagger: .07, ease: 'back.out(2)', scrollTrigger: { trigger: '.team', start: 'top 70%' } });

  /* reviews */
  const num = document.querySelector('.reviews__num'), o5 = { v: 0 };
  gsap.to(o5, { v: 5, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: num, start: 'top 85%' }, onUpdate: () => (num.textContent = Math.round(o5.v)) });
  gsap.from('.reviews__score .stars', { scale: 0, rotate: -90, duration: .8, ease: 'back.out(3)', scrollTrigger: { trigger: num, start: 'top 85%' } });
  gsap.from('.rv', { y: 120, opacity: 0, rotate: (i) => [-12, 10, -8, 12][i], duration: 1, stagger: .1, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.reviews__grid', start: 'top 88%' } });

  /* visit */
  gsap.from('.visit__img img', { clipPath: 'inset(100% 0 0 0 round 200px 200px 32px 32px)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.visit', start: 'top 70%' } });
  gsap.from('.visit__info li', { x: 50, opacity: 0, duration: .6, stagger: .08, ease: 'back.out(2)', scrollTrigger: { trigger: '.visit__info', start: 'top 88%' } });

  /* faq */
  gsap.from('.faq details', { y: 40, opacity: 0, duration: .6, stagger: .06, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.faq__list', start: 'top 88%' } });
  document.querySelectorAll('.faq details').forEach((d) => d.addEventListener('toggle', () => { if (d.open) gsap.from(d.querySelector('p'), { y: -10, opacity: 0, duration: .4 }); }));

  /* final */
  gsap.from('.final__btn', { scale: .4, opacity: 0, duration: 1.1, ease: 'elastic.out(1,.5)', scrollTrigger: { trigger: '.final__btn', start: 'top 92%' } });
  document.querySelectorAll('.floaty').forEach((f, i) => gsap.fromTo(f, { y: 80 * (i % 2 ? 1 : -1) }, { y: -80 * (i % 2 ? 1 : -1), ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom top', scrub: true } }));
  ScrollTrigger.create({ trigger: '.final__btn', start: 'top 70%', once: true, onEnter: () => { const r = document.querySelector('.final__btn').getBoundingClientRect(); setTimeout(() => burst(r.left + r.width / 2, r.top + r.height / 2), 700); } });

  /* magnetic */
  if (!touch) document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4 }); });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.4)' }));
  });

  /* whatsapp bubble */
  const waF = document.querySelector('.wa-float');
  setTimeout(() => { waF.classList.add('show-bubble'); setTimeout(() => waF.classList.remove('show-bubble'), 5000); }, 7000);

  addEventListener('load', () => ScrollTrigger.refresh());
})();
