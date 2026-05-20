/* =============================================
   NASSAA UTH HUB — Main JavaScript
   Version: 1.0.0
   Vanilla JS | Modular | No Dependencies
   ============================================= */

'use strict';

/* =============================================
   1. STICKY NAVBAR
   ============================================= */
(function initNavbar() {
    const navbar   = document.getElementById('navbar');
    const toggle   = document.getElementById('navToggle');
    const menu     = document.getElementById('navMenu');
    if (!navbar) return;

    /* Scroll-triggered glass effect */
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run once on load

    /* Mobile menu */
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('open');
            toggle.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        /* Close on nav link click */
        menu.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
                toggle.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* Highlight active page link */
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
    });
})();

/* =============================================
   2. SCROLL ANIMATIONS (Intersection Observer)
   ============================================= */
(function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-anim]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    elements.forEach(el => observer.observe(el));
})();

/* =============================================
   3. REVIEWS SLIDER
   ============================================= */
(function initReviewsSlider() {
    const slider     = document.getElementById('reviewsSlider');
    const track      = document.getElementById('reviewsTrack');
    const btnPrev    = document.getElementById('reviewsPrev');
    const btnNext    = document.getElementById('reviewsNext');
    const dotsWrap   = document.getElementById('reviewsDots');
    if (!slider || !track) return;

    const GAP        = 24; // px — must match CSS --slider-gap
    const cards      = Array.from(track.querySelectorAll('.review-card'));
    let cpv          = getCardsPerView();   // cards per view
    let currentPage  = 0;
    let totalPages   = calcTotalPages();
    let autoTimer    = null;

    function getCardsPerView() {
        if (window.innerWidth < 640)  return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }

    function calcTotalPages() {
        return Math.ceil(cards.length / cpv);
    }

    /* Size each card so cpv cards + their gaps fill the slider exactly */
    function applyCardWidths() {
        const w = (slider.offsetWidth - (cpv - 1) * GAP) / cpv;
        cards.forEach(c => {
            c.style.minWidth = w + 'px';
            c.style.maxWidth = w + 'px';
        });
    }

    /* Translate the track to show the correct page */
    function goTo(page) {
        currentPage = Math.max(0, Math.min(page, totalPages - 1));
        /* Each page offset = page * (slider width + 1 gap) */
        const offset = currentPage * (slider.offsetWidth + GAP);
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
    }

    /* Build / rebuild dot indicators */
    function buildDots() {
        dotsWrap.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = 'reviews-dot' + (i === currentPage ? ' active' : '');
            btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
            btn.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
            dotsWrap.appendChild(btn);
        }
    }

    function updateDots() {
        dotsWrap.querySelectorAll('.reviews-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentPage);
        });
    }

    /* Auto-advance */
    function startAuto() {
        autoTimer = setInterval(() => {
            goTo(currentPage < totalPages - 1 ? currentPage + 1 : 0);
        }, 5000);
    }
    function stopAuto() {
        clearInterval(autoTimer);
    }

    /* Button controls */
    btnPrev.addEventListener('click', () => {
        stopAuto();
        goTo(currentPage > 0 ? currentPage - 1 : totalPages - 1);
        startAuto();
    });
    btnNext.addEventListener('click', () => {
        stopAuto();
        goTo(currentPage < totalPages - 1 ? currentPage + 1 : 0);
        startAuto();
    });

    /* Pause on hover */
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    /* Touch / swipe support */
    let touchX = 0;
    track.addEventListener('touchstart', e => {
        touchX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', e => {
        const delta = touchX - e.changedTouches[0].clientX;
        if (Math.abs(delta) < 40) return;
        stopAuto();
        goTo(delta > 0
            ? (currentPage < totalPages - 1 ? currentPage + 1 : 0)
            : (currentPage > 0 ? currentPage - 1 : totalPages - 1)
        );
        startAuto();
    }, { passive: true });

    /* Recalculate on resize */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newCpv = getCardsPerView();
            if (newCpv !== cpv) {
                cpv = newCpv;
                totalPages = calcTotalPages();
                currentPage = 0;
                buildDots();
            }
            applyCardWidths();
            goTo(currentPage);
        }, 120);
    });

    /* Init */
    applyCardWidths();
    buildDots();
    goTo(0);
    startAuto();
})();

/* =============================================
   4. SCROLL-TO-TOP BUTTON
   ============================================= */
(function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* =============================================
   5. SMOOTH ANCHOR SCROLLING
   (Accounts for sticky nav height)
   ============================================= */
(function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
            const top  = target.getBoundingClientRect().top + window.scrollY - navH - 12;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();

/* =============================================
   6. LAZY LOADING IMAGES
   ============================================= */
(function initLazyImages() {
    const imgs = document.querySelectorAll('img[data-src]');
    if (!imgs.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });

    imgs.forEach(img => observer.observe(img));
})();

/* =============================================
   7. YOUTUBE LATEST SHORTS (3 videos)
   ============================================= */
(function initYTShorts() {
    const slots = ['ytShort1', 'ytShort2', 'ytShort3']
        .map(id => document.getElementById(id))
        .filter(Boolean);
    if (!slots.length) return;

    const API_KEY    = 'AIzaSyBLFo2ut1Xs7lF6Qomm_nQY954vJOCX0Fc';
    const CHANNEL_ID = 'UCgPrRetVjfkZwHPq5CyRFLQ';
    const PLAYLIST   = 'UU' + CHANNEL_ID.slice(2);

    fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST}&maxResults=20&key=${API_KEY}`)
        .then(r => r.json())
        .then(data => {
            const items = data.items || [];
            const shorts = items.filter(item => {
                const t = (item.snippet.title || '').toLowerCase();
                const d = (item.snippet.description || '').toLowerCase();
                return t.includes('#short') || d.includes('#short');
            });
            const picks = (shorts.length >= 3 ? shorts : items).slice(0, 3);
            picks.forEach((pick, i) => {
                const vid   = pick.snippet.resourceId.videoId;
                const title = pick.snippet.title || '';
                const thumb = (pick.snippet.thumbnails.maxres || pick.snippet.thumbnails.high || pick.snippet.thumbnails.medium).url;
                slots[i].innerHTML =
                    `<a href="https://www.youtube.com/shorts/${vid}" target="_blank" rel="noopener" class="yt-thumb-card">
                        <img src="${thumb}" alt="${title.replace(/"/g, '&quot;')}" class="yt-thumb-card__img" loading="lazy">
                        <div class="yt-thumb-card__overlay">
                            <div class="yt-thumb-card__play">
                                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                        </div>
                        <p class="yt-thumb-card__title">${title}</p>
                    </a>`;
            });
        })
        .catch(() => slots.forEach(s => s.innerHTML = ''));
})();
