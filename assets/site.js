// Index reel: hovering or focusing a product fills its name and swaps the side card.
(function () {
  var rows = Array.prototype.slice.call(document.querySelectorAll('.reel-row'));
  var card = document.getElementById('card');
  if (!rows.length || !card) return;
  var $ = function (id) { return document.getElementById(id); };
  var current = 0;

  // Launch countdowns: rows with data-launch (an ISO UTC instant) tick down,
  // then flip to Live on their own, so nobody has to edit the page at launch.
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function left(d) { return d.launch ? Date.parse(d.launch) - Date.now() : NaN; }
  function fmt(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
    return (d ? d + 'D ' : '') + pad(h) + 'H ' + pad(m) + 'M ' + pad(s % 60) + 'S';
  }
  function statusOf(d) {
    var ms = left(d);
    if (ms > 0) return 'Launch in ' + fmt(ms);
    return ms <= 0 ? 'Live' : d.status;
  }

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
    $('c-status').textContent = '● ' + statusOf(d).toUpperCase();
    $('c-icon').setAttribute('d', d.icon);
    $('c-name').textContent = d.name;
    $('c-line').textContent = d.line;
    var cta = $('c-cta');
    if (d.url) { cta.href = d.url; cta.textContent = d.where + ' ↗'; cta.removeAttribute('aria-disabled'); cta.style.pointerEvents = ''; }
    else { cta.removeAttribute('href'); cta.textContent = d.where + ' · ' + (left(d) > 0 ? 'launches ' + d.launchLabel : statusOf(d).toLowerCase()); cta.setAttribute('aria-disabled', 'true'); cta.style.pointerEvents = 'none'; }
    card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap');
  }

  rows.forEach(function (row, i) {
    var link = row.querySelector('.reel-link');
    link.addEventListener('mouseenter', function () { show(i); });
    link.addEventListener('focus', function () { show(i); });
    if (link.tagName === 'BUTTON') link.addEventListener('click', function () { show(i); });
  });

  var countEl = $('live-count');
  function tick() {
    var live = 0;
    rows.forEach(function (row, i) {
      var d = row.dataset, ms = left(d), t = row.querySelector('.reel-timer');
      if (ms > 0) {
        if (t) t.textContent = 'T\u2013' + fmt(ms);
      } else {
        if (t) t.textContent = '';
        var w = row.querySelector('.reel-when'); if (w && ms <= 0) w.textContent = 'Live';
      }
      if (statusOf(d) === 'Live') live++;
      if (i === current && d.launch) $('c-status').textContent = '\u25CF ' + statusOf(d).toUpperCase();
    });
    if (countEl) countEl.textContent = '(' + pad(rows.length) + ') PRODUCTS \u00B7 ' + live + ' LIVE';
  }
  tick();
  setInterval(tick, 1000);

  var yr = $('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
