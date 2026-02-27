(function () {
  'use strict';

  // -- Dark mode toggle --
  var html = document.documentElement;
  var toggleBtn = document.getElementById('theme-toggle');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getTheme() {
    var stored = localStorage.getItem('theme');
    if (stored) return stored;
    return prefersDark.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
  }

  function isDark() {
    return html.getAttribute('data-theme') === 'dark';
  }

  // Apply on load
  applyTheme(getTheme());

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('theme', next);
      updateHighlightColour();
    });
  }

  // Listen for OS preference changes (only when user hasn't overridden)
  prefersDark.addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
      updateHighlightColour();
    }
  });

  // -- Dynamic year --
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // -- Respect reduced motion --
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -- Rough Notation annotations --
  var engineerAnnotation = null;

  function getHighlightColour() {
    return isDark() ? 'rgba(255, 217, 61, 0.3)' : '#FFD93D';
  }

  function updateHighlightColour() {
    if (engineerAnnotation) {
      engineerAnnotation.color = getHighlightColour();
    }
  }

  if (typeof RoughNotation !== 'undefined' && !prefersReducedMotion) {
    var RN = RoughNotation;

    // Hero: underline on "Rupert"
    var nameEl = document.getElementById('annotate-name');
    var nameAnnotation = nameEl ? RN.annotate(nameEl, {
      type: 'underline',
      color: '#FF6B6B',
      strokeWidth: 3,
      padding: 2,
      animationDuration: 800
    }) : null;

    // About: circle around "accidental"
    var accidentalEl = document.getElementById('annotate-accidental');
    var accidentalAnnotation = accidentalEl ? RN.annotate(accidentalEl, {
      type: 'circle',
      color: '#4DABF7',
      strokeWidth: 2,
      padding: 5,
      animationDuration: 1000
    }) : null;

    // About: highlight on "engineer"
    var engineerEl = document.getElementById('annotate-engineer');
    engineerAnnotation = engineerEl ? RN.annotate(engineerEl, {
      type: 'highlight',
      color: getHighlightColour(),
      strokeWidth: 2,
      animationDuration: 800,
      multiline: true
    }) : null;

    // Quote: underline on "adventure"
    var adventureEl = document.getElementById('annotate-adventure');
    var adventureAnnotation = adventureEl ? RN.annotate(adventureEl, {
      type: 'underline',
      color: '#FFD93D',
      strokeWidth: 3,
      padding: 2,
      animationDuration: 800
    }) : null;

    // Show hero annotation immediately on load
    if (nameAnnotation) {
      nameAnnotation.show();
    }

    // Observe about section for scroll-triggered annotations
    if ('IntersectionObserver' in window) {
      var aboutSection = document.getElementById('about');
      if (aboutSection) {
        var aboutObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              // Sequence: highlight first, then circle
              if (engineerAnnotation) engineerAnnotation.show();
              setTimeout(function () {
                if (accidentalAnnotation) accidentalAnnotation.show();
              }, 600);
              aboutObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
        aboutObserver.observe(aboutSection);
      }

      // Observe quote section
      var quoteSection = document.getElementById('quote');
      if (quoteSection) {
        var quoteObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (adventureAnnotation) adventureAnnotation.show();
              quoteObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
        quoteObserver.observe(quoteSection);
      }
    } else {
      // Fallback: show all annotations immediately
      if (accidentalAnnotation) accidentalAnnotation.show();
      if (engineerAnnotation) engineerAnnotation.show();
      if (adventureAnnotation) adventureAnnotation.show();
    }
  }

  // -- Fade-in animations on scroll --
  var fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback: make everything visible
    fadeElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
