// появление блоков при скролле
const revealTargets = document.querySelectorAll(
  '.card, .obj, .era, .exhibit, .steps li, .section-head, .contact-card, .sro, .hero-actions, .hero-stats'
);
revealTargets.forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = (i % 6) * 60 + 'ms'; });
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
revealTargets.forEach((el) => io.observe(el));

// счётчики в hero
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10); const suffix = el.dataset.suffix || '';
  const dur = 1400; const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1); const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target) + suffix; if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
}, { threshold: 0.5 });
counters.forEach((el) => cio.observe(el));

// фильтр объектов
const chips = document.querySelectorAll('.obj-chip');
const objs = document.querySelectorAll('.obj');
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.f;
    objs.forEach((o) => {
      const show = f === 'all' || o.dataset.cat.split(' ').includes(f);
      o.classList.toggle('hide', !show);
    });
  });
});

// переключатель темы
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const light = document.body.classList.toggle('light');
    themeBtn.textContent = light ? '☾' : '☀ / ☾';
    try { localStorage.setItem('rsi-theme', light ? 'light' : 'dark'); } catch (e) {}
  });
  try { if (localStorage.getItem('rsi-theme') === 'light') { document.body.classList.add('light'); themeBtn.textContent = '☾'; } } catch (e) {}
}

// музей: раскрытие описания экспоната
document.querySelectorAll('.exhibit-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const ex = btn.closest('.exhibit'); const open = ex.classList.toggle('open');
    btn.textContent = open ? 'Свернуть ↑' : 'Описание экспоната ↓';
  });
});

// мобильное меню
const burger = document.querySelector('.burger'); const header = document.querySelector('.site-header');
if (burger) {
  burger.addEventListener('click', () => header.classList.toggle('mobile-open'));
  document.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => header.classList.remove('mobile-open')));
}

// параллакс фона
const photo = document.querySelector('.hero-photo');
const fl1 = document.querySelector('.floater-1'), fl2 = document.querySelector('.floater-2'), fl3 = document.querySelector('.floater-3');
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    if (photo) photo.style.transform = 'scale(1.05) translateY(' + y * 0.18 + 'px)';
    if (fl1) fl1.style.transform = 'translateY(' + y * 0.25 + 'px)';
    if (fl2) fl2.style.transform = 'translateY(' + y * -0.18 + 'px)';
    if (fl3) fl3.style.transform = 'translateY(' + y * 0.12 + 'px)';
    ticking = false;
  });
}, { passive: true });
