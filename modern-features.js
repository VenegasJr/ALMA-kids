/**
 * MODERN FEATURES 2025 - ALMA Kids
 * - Scroll progress bar
 * - Scroll reveal (Intersection Observer API)
 * - Animated stats counter
 * - prefers-reduced-motion respecto
 */
(function () {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ============================================================
       1. SCROLL PROGRESS BAR
       ============================================================ */
    const progressBar = document.getElementById('scroll-progress');

    if (progressBar) {
        const updateProgress = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
            progressBar.style.width = pct + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    /* ============================================================
       2. SCROLL REVEAL — Intersection Observer
       ============================================================ */
    if (!prefersReduced && 'IntersectionObserver' in window) {
        const revealEls = document.querySelectorAll('[data-reveal]');

        if (revealEls.length) {
            const revealObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('revealed');
                            revealObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
            );
            revealEls.forEach((el) => revealObserver.observe(el));
        }
    } else {
        /* Fallback: mostrar todo inmediatamente */
        document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('revealed'));
    }

    /* ============================================================
       3. STATS COUNTER ANIMATION
       ============================================================ */
    const counters = document.querySelectorAll('.stat-number[data-target]');

    if (counters.length && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        counters.forEach((c) => counterObserver.observe(c));
    } else {
        /* Sin IntersectionObserver: mostrar valores finales */
        counters.forEach((c) => (c.textContent = c.dataset.target));
    }

    function animateCounter(el) {
        if (prefersReduced) {
            el.textContent = el.dataset.target;
            return;
        }
        const target = parseInt(el.dataset.target, 10);
        const duration = 1600;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            /* Ease out cubic */
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }
        requestAnimationFrame(update);
    }

})();
