// Index reel: hovering or focusing a product fills its name and swaps the side card.
(function () {
  var rows = Array.prototype.slice.call(document.querySelectorAll('.reel-row'));
  var card = document.getElementById('card');
  if (!rows.length || !card) return;
  var $ = function (id) { return document.getElementById(id); };
  var current = 0;

  function show(i) {
    if (i === current) return;
    var d = rows[i].dataset;
    rows[current].classList.remove('on');
    rows[i].classList.add('on');
    current = i;
    card.style.setProperty('--c-bg', d.bg);
    card.style.setProperty('--c-ink', d.ink);
    card.style.setProperty('--c-rule', d.rule);
    $('c-cat').textContent = d.cat.toUpperCase();
    $('c-status').textContent = '● ' + d.status.toUpperCase();
    $('c-icon').setAttribute('d', d.icon);
    $('c-name').textContent = d.name;
    $('c-line').textContent = d.line;
    var cta = $('c-cta');
    if (d.url) { cta.href = d.url; cta.textContent = d.where + ' ↗'; cta.removeAttribute('aria-disabled'); cta.style.pointerEvents = ''; }
    else { cta.removeAttribute('href'); cta.textContent = d.where + ' · ' + d.status.toLowerCase(); cta.setAttribute('aria-disabled', 'true'); cta.style.pointerEvents = 'none'; }
    card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap');
  }

  rows.forEach(function (row, i) {
    var link = row.querySelector('.reel-link');
    link.addEventListener('mouseenter', function () { show(i); });
    link.addEventListener('focus', function () { show(i); });
    if (link.tagName === 'BUTTON') link.addEventListener('click', function () { show(i); });
  });

  var yr = $('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
