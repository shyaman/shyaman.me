/*
 * Vanilla replacement for the template's jQuery stack (smooth scroll via
 * CSS scroll-behavior, Bootstrap collapse toggle, scrollspy) plus a
 * scroll-reveal effect. No dependencies.
 */
(function () {
    'use strict';

    // Mobile nav: toggle the Bootstrap .collapse panel and close it after
    // a link is chosen.
    var toggler = document.querySelector('#sideNav .navbar-toggler');
    var collapse = document.getElementById('navbarSupportedContent');
    if (toggler && collapse) {
        toggler.addEventListener('click', function () {
            var open = collapse.classList.toggle('show');
            toggler.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        collapse.addEventListener('click', function (event) {
            if (event.target.closest('a')) {
                collapse.classList.remove('show');
                toggler.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Scrollspy: highlight the nav link for the section in view.
    var links = Array.prototype.slice.call(
        document.querySelectorAll('#sideNav .navbar-nav .nav-link[href^="#"]')
    );
    var sections = links
        .map(function (link) {
            return document.querySelector(link.getAttribute('href'));
        })
        .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
        var setActive = function (id) {
            links.forEach(function (link) {
                var on = link.getAttribute('href') === '#' + id;
                link.classList.toggle('active', on);
                if (on) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };
        var spy = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                });
            },
            // A narrow band around the upper-middle of the viewport decides
            // which section counts as "current".
            { rootMargin: '-40% 0px -55% 0px' }
        );
        sections.forEach(function (section) {
            spy.observe(section);
        });
    }

    // Scroll-reveal: fade items up as they enter the viewport. The .reveal
    // class is added here (not in the markup) so content is never hidden
    // when JavaScript is unavailable.
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion && 'IntersectionObserver' in window) {
        var items = document.querySelectorAll(
            '.resume-item, .pub-item, section.resume-section h2'
        );
        var revealer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        revealer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        items.forEach(function (item) {
            item.classList.add('reveal');
            revealer.observe(item);
        });
    }
})();
