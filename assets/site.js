// Index reel: hovering or focusing a product fills its name and swaps the side card.
// Clicking a product opens its sheet: the animated card plus more about it.
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
  function paint(el, d) {
    el.style.setProperty('--c-bg', d.bg);
    el.style.setProperty('--c-ink', d.ink);
    el.style.setProperty('--c-rule', d.rule);
  }

  function show(i) {
    if (i === current) return;
    var d = rows[i].dataset;
    rows[current].classList.remove('on');
    rows[i].classList.add('on');
    current = i;
    paint(card, d);
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

  // ---- Product sheet ------------------------------------------------------
  var sheet = $('sheet');
  var canSheet = !!(sheet && typeof sheet.showModal === 'function');
  var sCard = $('s-card');
  var open = -1;

  function fillCta(d) {
    var cta = $('s-cta');
    if (d.url) {
      cta.href = d.url;
      cta.textContent = (left(d) > 0 && d.ctaSoon ? d.ctaSoon : (d.cta || 'Visit ' + d.where)) + ' ↗';
      cta.removeAttribute('aria-disabled');
    } else {
      cta.removeAttribute('href');
      cta.textContent = d.where + (left(d) > 0 ? ' · launches ' + d.launchLabel : ' · ' + d.status.toLowerCase());
      cta.setAttribute('aria-disabled', 'true');
    }
  }

  function sheetTick() {
    if (open < 0) return;
    var d = rows[open].dataset, ms = left(d);
    $('s-status').textContent = '● ' + statusOf(d).toUpperCase();
    var t = $('s-timer');
    if (ms > 0) {
      t.hidden = false;
      $('s-count').textContent = fmt(ms);
      $('s-when').textContent = d.launchLabel;
    } else {
      t.hidden = true;
    }
    fillCta(d);
  }

  function openSheet(i) {
    var row = rows[i], d = row.dataset;
    open = i;
    show(i);
    paint(sheet, d);
    $('s-cat').textContent = d.cat.toUpperCase();
    $('s-icon').setAttribute('d', d.icon);
    $('s-card-name').textContent = d.name;
    $('s-card-where').textContent = d.where;
    $('s-no').textContent = pad(i + 1) + ' / ' + pad(rows.length);
    $('s-name').textContent = d.name;
    $('s-line').textContent = d.line;
    var list = $('s-facts');
    list.textContent = '';
    var src = row.querySelectorAll('.reel-more li');
    for (var k = 0; k < src.length; k++) {
      var li = document.createElement('li');
      li.textContent = src[k].textContent;
      li.style.animationDelay = (0.18 + k * 0.07) + 's';
      list.appendChild(li);
    }
    sheetTick();
    sCard.style.transform = '';
    sheet.classList.remove('in'); void sheet.offsetWidth;
    if (!sheet.open) sheet.showModal();
    sheet.classList.add('in');
    document.documentElement.classList.add('sheet-open');
  }

  if (canSheet) {
    sheet.addEventListener('close', function () {
      open = -1;
      document.documentElement.classList.remove('sheet-open');
    });
    // A click on the dimmed backdrop lands on the dialog element itself.
    sheet.addEventListener('click', function (e) { if (e.target === sheet) sheet.close(); });
    $('s-close').addEventListener('click', function () { sheet.close(); });

    // The card tilts toward the pointer, with a glare that follows it.
    var tilt = window.matchMedia && matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches;
    if (tilt) {
      sCard.addEventListener('pointermove', function (e) {
        var r = sCard.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        sCard.style.transform = 'perspective(900px) rotateY(' + (x * 10).toFixed(2) + 'deg) rotateX(' + (-y * 10).toFixed(2) + 'deg)';
        sCard.style.setProperty('--gx', ((x + 0.5) * 100).toFixed(1) + '%');
        sCard.style.setProperty('--gy', ((y + 0.5) * 100).toFixed(1) + '%');
      });
      sCard.addEventListener('pointerleave', function () { sCard.style.transform = ''; });
    }
  }

  rows.forEach(function (row, i) {
    var link = row.querySelector('.reel-link');
    link.addEventListener('mouseenter', function () { show(i); });
    link.addEventListener('focus', function () { show(i); });
    if (canSheet) link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', function (e) {
      // Modified clicks still open the product's own site in a new tab.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (!canSheet) { show(i); return; }
      e.preventDefault();
      openSheet(i);
    });
  });

  // ---- Clock --------------------------------------------------------------
  var countEl = $('live-count');
  function tick() {
    var live = 0;
    rows.forEach(function (row, i) {
      var d = row.dataset, ms = left(d), t = row.querySelector('.reel-timer');
      if (ms > 0) {
        if (t) t.textContent = 'T–' + fmt(ms);
      } else {
        if (t) t.textContent = '';
        var w = row.querySelector('.reel-when'); if (w && ms <= 0) w.textContent = 'Live';
      }
      if (statusOf(d) === 'Live') live++;
      if (i === current && d.launch) $('c-status').textContent = '● ' + statusOf(d).toUpperCase();
    });
    if (countEl) countEl.textContent = '(' + pad(rows.length) + ') PRODUCTS · ' + live + ' LIVE';
    sheetTick();
  }
  tick();
  setInterval(tick, 1000);

  var yr = $('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
