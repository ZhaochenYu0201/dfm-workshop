/* Progressive enhancement only. The page is complete without this file.
   No timers are started, ever. Scroll work is passive and rAF-throttled. */
(function () {
  'use strict';

  var header = document.getElementById('header');
  var toggle = document.querySelector('.menu-toggle');
  var navbar = document.getElementById('navbar');
  var topBtn = document.querySelector('.back-to-top');
  var links = navbar ? Array.prototype.slice.call(navbar.querySelectorAll('a[href^="#"]')) : [];
  /* Every section in the document, not only the ten the nav lists. Built from the
     nav alone, the spy kept aria-current="location" on the preceding item while the
     reader was inside #paradigms, #access or #significance - three sections the nav
     has no room for. Reading all of them lets the spy say nothing rather than
     something false. */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ----------------------------------------------------------- mobile menu */
  function closeMenu(focusToggle) {
    if (!header || !toggle) return;
    header.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open the section menu');
    if (focusToggle) toggle.focus();
  }

  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close the section menu' : 'Open the section menu');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) closeMenu(true);
    });
    if (navbar) {
      navbar.addEventListener('click', function (e) {
        if (e.target.closest('a')) closeMenu(false);
      });
    }
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1179) closeMenu(false);   /* matches the CSS breakpoint */
    });
  }

  /* ------------------------------------------- header state and scroll spy */
  var scheduled = false;

  function paint() {
    scheduled = false;
    var y = window.scrollY || window.pageYOffset || 0;

    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (topBtn) topBtn.classList.toggle('is-visible', y > 400);

    if (!sections.length) return;
    var line = y + 140;
    var activeId = null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= line) activeId = sections[i].id;
    }
    if (y + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      activeId = sections[sections.length - 1].id;
    }
    for (var j = 0; j < links.length; j++) {
      var match = links[j].getAttribute('href') === '#' + activeId;
      if (match) links[j].setAttribute('aria-current', 'location');
      else links[j].removeAttribute('aria-current');
    }
  }

  function onScroll() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(paint);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  paint();

  /* ------------------------------------------------------------ back to top */
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' });
      var brand = document.querySelector('.brand');
      if (brand) brand.focus({ preventScroll: true });
    });
  }
}());
