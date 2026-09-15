document.addEventListener('DOMContentLoaded', function () {

  /* ─── Timeline items with an emblem need extra padding (fallback for :has) ─── */
  document.querySelectorAll('.tl-item').forEach(function (li) {
    if (li.querySelector('.tl-emblem')) li.classList.add('has-emblem');
  });

  /* ─── Reveal on scroll ─── */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var sibs = Array.prototype.slice.call(
          el.parentElement ? el.parentElement.querySelectorAll(':scope > .reveal') : []
        );
        el.style.transitionDelay = Math.min(Math.max(0, sibs.indexOf(el)) * 65, 300) + 'ms';
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });

    setTimeout(function () {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-visible');
      });
    }, 2500);
  }

  /* ─── Nav highlight: last section whose top passed the header ─── */
  var targets = Array.prototype.slice.call(document.querySelectorAll('.navlink'))
    .map(function (link) { return { link: link, el: document.querySelector(link.getAttribute('href')) }; })
    .filter(function (t) { return t.el; });

  if (targets.length) {
    var queued = false;
    function syncNav() {
      queued = false;
      var current = null;
      targets.forEach(function (t) {
        if (t.el.getBoundingClientRect().top <= 90) current = t;
      });
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = targets[targets.length - 1];
      }
      targets.forEach(function (t) { t.link.classList.toggle('is-active', t === current); });
    }
    function onScroll() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(syncNav);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    syncNav();
  }

  /* ─── Easter egg: type "onepiece" ─── */
  (function () {
    var egg = document.getElementById('egg');
    if (!egg) return;
    var target = 'onepiece', buf = '', timer;

    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[a-zA-Z]$/.test(e.key)) {
        buf = (buf + e.key.toLowerCase()).slice(-target.length);
        if (buf === target) {
          buf = '';
          egg.hidden = false;
          requestAnimationFrame(function () { egg.classList.add('show'); });
          clearTimeout(timer);
          timer = setTimeout(function () {
            egg.classList.remove('show');
            setTimeout(function () { egg.hidden = true; }, 320);
          }, 3600);
        }
      }
    });
  })();

});
