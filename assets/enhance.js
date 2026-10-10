/* Progressive enhancement only. Everything below is additive: with JavaScript
   disabled the page is complete, nothing is hidden and no state is missing.
   No timers are started, under reduced motion or otherwise. */
(function () {
  "use strict";

  var reduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Mark the section currently in view in the page navigation. */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav a[href^="#"]')
  );
  var byId = {};
  var targets = [];
  links.forEach(function (a) {
    var el = document.getElementById(a.getAttribute("href").slice(1));
    if (el) { byId[el.id] = a; targets.push(el); }
  });

  if (targets.length && "IntersectionObserver" in window) {
    var visible = Object.create(null);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { visible[e.target.id] = true; }
        else { delete visible[e.target.id]; }
      });
      var first = null;
      for (var i = 0; i < targets.length; i++) {
        if (visible[targets[i].id]) { first = targets[i].id; break; }
      }
      links.forEach(function (a) { a.removeAttribute("aria-current"); });
      if (first && byId[first]) { byId[first].setAttribute("aria-current", "location"); }
    }, { rootMargin: "-72px 0px -62% 0px", threshold: 0 });
    targets.forEach(function (el) { spy.observe(el); });
  }

  /* 2. A short entrance for section bodies. The hidden state is added here, so
        it can never strand content when scripting is off. Under reduced motion
        the distance is dropped by the stylesheet and only opacity moves. */
  if ("IntersectionObserver" in window) {
    var blocks = document.querySelectorAll(
      ".sec__head, .triad, .numbered > li, .topics > li, .tracks > li," +
      " .dates > li, .person, .scroller, .pullquote, .teaser__plate"
    );
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        e.target.classList.add("is-in");
        obs.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.02 });

    Array.prototype.forEach.call(blocks, function (el) {
      var box = el.getBoundingClientRect();
      if (box.top < window.innerHeight) { return; }  /* already on screen */
      el.classList.add("js-reveal");
      io.observe(el);
    });
  }

  /* 3. Tell assistive technology the wide table can be scrolled only when it
        actually overflows, so the region is not announced for nothing. */
  Array.prototype.forEach.call(document.querySelectorAll(".scroller"), function (el) {
    var fits = el.scrollWidth <= el.clientWidth;
    if (fits && el.getAttribute("role") === "region") {
      el.removeAttribute("role");
      el.removeAttribute("tabindex");
      el.removeAttribute("aria-label");
    }
  });

  void reduced;
})();
