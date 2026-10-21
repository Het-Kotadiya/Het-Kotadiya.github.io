/* Het Kotadiya — theme switch + visual effects. */
(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  // Theme: use the visitor's saved choice, if any
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}

  // Turn on scroll-in animation only when it is safe to
  if (!reduceMotion && 'IntersectionObserver' in window) root.classList.add('fx');

  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function updateLabel(btn) {
    btn.setAttribute('aria-label', currentTheme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  document.addEventListener('DOMContentLoaded', function () {
    // 1. Theme switch button
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.hidden = false;
      updateLabel(btn);
      btn.addEventListener('click', function () {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        updateLabel(btn);
      });
    }

    // 2. Squares fade in as you scroll
    if (root.classList.contains('fx')) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          io.unobserve(el);
          el.classList.add('in');
          setTimeout(function () { el.classList.remove('in'); el.classList.add('done'); }, 1000);
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.tile, .section-head').forEach(function (el) {
        var i = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.setProperty('--d', (Math.min(i, 5) * 70) + 'ms');
        io.observe(el);
      });
    }

    // 3. Frosted header shows a thin line once you scroll
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // 4. Soft dot cursor, a light that follows the mouse on squares, click ring (mouse only)
    if (finePointer && !reduceMotion) {
      var cursor = document.createElement('div');
      cursor.className = 'cursor';
      cursor.setAttribute('aria-hidden', 'true');
      document.body.appendChild(cursor);

      // The dot sits exactly on the mouse (no lag), so clicks land right where it is
      document.addEventListener('mousemove', function (e) {
        var x = e.clientX, y = e.clientY;
        cursor.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        cursor.classList.add('on');
        var tile = e.target.closest && e.target.closest('.tile');
        if (tile) {
          var r = tile.getBoundingClientRect();
          tile.style.setProperty('--mx', (x - r.left) + 'px');
          tile.style.setProperty('--my', (y - r.top) + 'px');
        }
      });
      document.documentElement.addEventListener('mouseleave', function () { cursor.classList.remove('on'); });
      document.addEventListener('mouseover', function (e) {
        cursor.classList.toggle('hover', !!e.target.closest('a, button'));
      });
      document.addEventListener('mousedown', function () { cursor.classList.add('press'); });
      document.addEventListener('mouseup', function () { cursor.classList.remove('press'); });

      document.addEventListener('click', function (e) {
        var ring = document.createElement('span');
        ring.className = 'ripple';
        ring.setAttribute('aria-hidden', 'true');
        ring.style.left = e.clientX + 'px';
        ring.style.top = e.clientY + 'px';
        document.body.appendChild(ring);
        ring.addEventListener('animationend', function () { ring.remove(); });
      });
    }
  });
})();
