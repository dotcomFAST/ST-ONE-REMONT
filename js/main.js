
// filters
document.querySelectorAll('.f').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.f').forEach(x => x.setAttribute('aria-pressed', x === b));
  const f = b.dataset.f;
  document.querySelectorAll('.g').forEach(g => g.classList.toggle('hide', f !== 'all' && g.dataset.c !== f));
}));
// lightbox
const lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg');
document.querySelectorAll('.g').forEach(g => g.addEventListener('click', () => {
  const i = g.querySelector('img'); lbImg.src = i.src; lbImg.alt = i.alt; lb.classList.add('open');
}));
const closeLb = () => lb.classList.remove('open');
document.getElementById('lbClose').onclick = closeLb;
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
// before / after
const r = document.getElementById('baRange');
const setBA = v => {
  document.getElementById('afterWrap').style.clipPath = `inset(0 0 0 ${v}%)`;
  document.getElementById('baBar').style.left = v + '%';
  document.getElementById('baKnob').style.left = v + '%';
};
r.addEventListener('input', () => setBA(r.value)); setBA(50);
// form -> telegram preview
document.getElementById('calcForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name'), tel = document.getElementById('tel');
  if (!name.value.trim() || !tel.value.trim()) { (name.value.trim() ? tel : name).focus(); return; }
  const svc = [...document.querySelectorAll('input[name=svc]:checked')].map(x => x.value).join(', ') || '—';
  const text = [
    '🏠 Нова заявка з сайту',
    'Об\'єкт: ' + document.querySelector('input[name=type]:checked').value,
    'Площа: ' + (document.getElementById('area').value ? document.getElementById('area').value + ' м²' : '—'),
    'Стан: ' + document.getElementById('state').value,
    'Послуги: ' + svc,
    'Де: ' + (document.getElementById('where').value || '—'),
    '', 'Ім\'я: ' + name.value, 'Телефон: ' + tel.value
  ].join('\n');
  document.getElementById('tgText').textContent = text;
  document.getElementById('tg').style.display = 'block';
});
const money = n => n.toLocaleString('uk-UA');
document.getElementById('topPrices').innerHTML = TOP.map(([n,p,u]) => `<div class="tp"><span>${n}</span><b>від ${money(p)}<small> грн/${u}</small></b></div>`).join('');
const esc = s => s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const list = document.getElementById('priceList');
list.innerHTML = PRICES.map(([cat, items], i) => `
  <details class="pc"><summary><span>${cat}<small>${items.length} позицій</small></span></summary>
    ${items.map(([n,p,u,from]) => `<div class="pr" data-n="${esc(n.toLowerCase())}"><span>${esc(n)}</span><b>${from?'від ':''}${money(p)} <small>грн/${u}</small></b></div>`).join('')}
  </details>`).join('');
const search = document.getElementById('priceSearch');
search.addEventListener('input', () => {
  const q = search.value.trim().toLowerCase();
  let any = false;
  list.querySelectorAll('.pc').forEach(pc => {
    let hits = 0;
    pc.querySelectorAll('.pr').forEach(r => {
      const span = r.querySelector('span'); const name = span.textContent;
      const ok = !q || r.dataset.n.includes(q);
      r.classList.toggle('hide', !ok); if (ok) hits++;
      if (q && ok) { const i = name.toLowerCase().indexOf(q); span.innerHTML = esc(name.slice(0,i)) + '<mark>' + esc(name.slice(i,i+q.length)) + '</mark>' + esc(name.slice(i+q.length)); }
      else span.textContent = name;
    });
    pc.style.display = hits ? '' : 'none';
    pc.open = q ? hits > 0 : false;
    if (hits) any = true;
  });
  document.getElementById('priceEmpty').hidden = any;
  if (!q) document.getElementById('toggleAll').textContent = 'Розгорнути все';
});
const tgl = document.getElementById('toggleAll');
tgl.addEventListener('click', () => {
  const open = tgl.textContent.includes('Розгорнути');
  list.querySelectorAll('.pc').forEach(pc => pc.open = open);
  tgl.textContent = open ? 'Згорнути все' : 'Розгорнути все';
});

// reveal
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
