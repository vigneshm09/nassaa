/* =============================================
   NASSAA UTH HUB — GSAP Animation System
   Version: 2.0.0
   Requires: gsap 3.12.5 + ScrollTrigger
   ============================================= */

'use strict';

gsap.registerPlugin(ScrollTrigger);

/* ── Immediately kill CSS conflicts before paint ─ */
(function killCSSConflicts() {
    /* Disable CSS transition on all [data-anim] elements */
    document.querySelectorAll('[data-anim]').forEach(el => {
        el.style.transition = 'none';
    });

    /* Freeze hero elements before CSS fadeUp fires */
    const heroTargets = [
        '.hero__badge', '.hero__title', '.hero__subtitle',
        '.hero__cta', '.hero__stats', '.hero__scroll'
    ];
    heroTargets.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.style.animation = 'none';
            el.style.opacity   = '0';
            el.style.transform = 'translateY(0)';
        });
    });

    /* Freeze inner page-hero elements before CSS fadeUp fires */
    const pageHeroTargets = [
        '.page-hero__tag', '.page-hero__title',
        '.page-hero__subtitle', '.page-hero__meta-item'
    ];
    pageHeroTargets.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.style.animation = 'none';
            el.style.opacity   = '0';
        });
    });
})();

/* =============================================
   0. SPLIT TEXT UTILITY
   ============================================= */
function splitTextPreserveHTML(selectorOrElement) {
    const elements = typeof selectorOrElement === 'string' 
        ? document.querySelectorAll(selectorOrElement) 
        : [selectorOrElement];
        
    elements.forEach(el => {
        if (!el || el.classList.contains('is-split')) return;
        
        const temp = document.createElement('div');
        temp.innerHTML = el.innerHTML;
        
        const processNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (!text.trim()) return document.createTextNode(text);
                
                const words = text.split(/(\s+)/);
                const fragment = document.createDocumentFragment();
                
                words.forEach(word => {
                    if (!word.trim()) {
                        fragment.appendChild(document.createTextNode(word));
                        return;
                    }
                    const wrap = document.createElement('span');
                    wrap.style.display = 'inline-block';
                    wrap.style.overflow = 'hidden';
                    wrap.style.verticalAlign = 'bottom';
                    wrap.style.padding = '0.15em 0';
                    wrap.style.margin = '-0.15em 0';
                    
                    const inner = document.createElement('span');
                    inner.style.display = 'inline-block';
                    inner.style.transform = 'translateY(110%) rotate(3deg)';
                    inner.style.transformOrigin = 'top left';
                    inner.style.opacity = '0';
                    inner.className = 'split-word';
                    inner.textContent = word;
                    
                    wrap.appendChild(inner);
                    fragment.appendChild(wrap);
                });
                return fragment;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const clone = node.cloneNode(false);
                Array.from(node.childNodes).forEach(child => {
                    const processed = processNode(child);
                    if (processed) clone.appendChild(processed);
                });
                return clone;
            }
            return node.cloneNode(true);
        };
        
        const newContent = document.createDocumentFragment();
        Array.from(temp.childNodes).forEach(child => {
            const processed = processNode(child);
            if (processed) newContent.appendChild(processed);
        });
        
        el.innerHTML = '';
        el.appendChild(newContent);
        el.classList.add('is-split');
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.animation = 'none';
    });
}

/* =============================================
   1. CUSTOM CURSOR (desktop only)
   ============================================= */
function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    /* Use xPercent/yPercent so GSAP handles centering — no CSS transform conflict */
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    let mx = -200, my = -200;  /* Start offscreen */
    let rx = mx,   ry = my;

    window.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        gsap.set(dot, { x: mx, y: my });
    }, { passive: true });

    gsap.ticker.add(() => {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        gsap.set(ring, { x: rx, y: ry });
    });

    /* Hover state */
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(ring, { scale: 1.8, opacity: 0.45, duration: 0.25, ease: 'power2.out' });
            gsap.to(dot,  { scale: 0.4, duration: 0.2 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
            gsap.to(dot,  { scale: 1, duration: 0.2 });
        });
    });
}

/* =============================================
   2. PAGE LOADER (index.html only)
   ============================================= */
function initLoader() {
    const loader = document.getElementById('gsap-loader');
    if (!loader) {
        window.addEventListener('load', startHeroAnimation);
        return;
    }

    const tl    = document.querySelector('.gl-logo__part--tl');
    const tr    = document.querySelector('.gl-logo__part--tr');
    const bl    = document.querySelector('.gl-logo__part--bl');
    const br    = document.querySelector('.gl-logo__part--br');
    const fill  = loader.querySelector('.gl-fill');
    const label = loader.querySelector('.gl-label');

    const parts = [tl, tr, bl, br].filter(Boolean);

    /* Start all parts invisible */
    gsap.set(parts, { opacity: 0 });

    const master = gsap.timeline({
        onComplete: () => {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.45,
                ease: 'power2.inOut',
                onComplete: () => {
                    loader.style.display = 'none';
                    startHeroAnimation();
                }
            });
        }
    });

    /* Logo fade and fill bar start at the same time */
    master.to(parts, { opacity: 1, duration: 2.2, ease: 'power2.out' }, 0);
    if (fill)  master.to(fill,  { width: '100%', duration: 2.0, ease: 'power1.inOut' }, 0);
    if (label) master.to(label, { opacity: 0, duration: 0.25 }, '-=0.25');
}

/* =============================================
   3. HOMEPAGE HERO TIMELINE
   ============================================= */
function startHeroAnimation() {
    const badge    = document.querySelector('.hero__badge');
    const title    = document.querySelector('.hero__title');
    const subtitle = document.querySelector('.hero__subtitle');
    const cta      = document.querySelector('.hero__cta');
    const stats    = document.querySelector('.hero__stats');
    const scroll   = document.querySelector('.hero__scroll');

    if (!badge && !title) return; /* Not the homepage */

    const tl = gsap.timeline({ delay: 0.05 });

    if (badge)    tl.fromTo(badge,    { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' });
    if (title) {
        splitTextPreserveHTML(title);
        const words = title.querySelectorAll('.split-word');
        if (words.length) {
            tl.to(title, { opacity: 1, y: 0, duration: 0.01 }, '-=0.3');
            tl.fromTo(words, 
                { opacity: 0, y: '110%', rotate: 3 }, 
                { opacity: 1, y: '0%', rotate: 0, duration: 0.8, stagger: 0.04, ease: 'power4.out' }, 
                '-=0.3'
            );
        } else {
            tl.fromTo(title, { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3');
        }
    }
    if (subtitle) tl.fromTo(subtitle, { opacity: 0, y: 28  }, { opacity: 1, y: 0, duration: 0.7,  ease: 'power3.out' }, '-=0.45');
    if (cta)      tl.fromTo(cta,      { opacity: 0, y: 24  }, { opacity: 1, y: 0, duration: 0.6,  ease: 'power3.out' }, '-=0.4');
    if (stats)    tl.fromTo(stats,    { opacity: 0, y: 20  }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.35');
    if (scroll)   tl.fromTo(scroll,   { opacity: 0         }, { opacity: 1,       duration: 0.5              }, '-=0.1');
}

/* =============================================
   4. INNER PAGE HERO
   ============================================= */
function initPageHero() {
    const hero = document.querySelector('.page-hero');
    if (!hero) return;

    const tl = gsap.timeline({ delay: 0.2 });

    const tag      = hero.querySelector('.page-hero__tag');
    const title    = hero.querySelector('.page-hero__title');
    const subtitle = hero.querySelector('.page-hero__subtitle');
    const metas    = hero.querySelectorAll('.page-hero__meta-item');

    if (tag)      tl.fromTo(tag,      { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5,  ease: 'back.out(1.5)' });
    if (title) {
        splitTextPreserveHTML(title);
        const words = title.querySelectorAll('.split-word');
        if (words.length) {
            tl.to(title, { opacity: 1, y: 0, duration: 0.01 }, '-=0.2');
            tl.fromTo(words, 
                { opacity: 0, y: '110%', rotate: 3 }, 
                { opacity: 1, y: '0%', rotate: 0, duration: 0.75, stagger: 0.04, ease: 'power4.out' }, 
                '-=0.2'
            );
        } else {
            tl.fromTo(title, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.2');
        }
    }
    if (subtitle) tl.fromTo(subtitle, { opacity: 0, y: 24        }, { opacity: 1, y: 0,     duration: 0.65, ease: 'power3.out' }, '-=0.4');
    if (metas.length) tl.fromTo(metas, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.3');
}

/* =============================================
   5. SCROLL REVEAL — [data-anim] elements
   ============================================= */
function initScrollReveal() {
    const map = {
        'fade-up'    : { y: 44 },
        'fade-down'  : { y: -36 },
        'fade-right' : { x: -48 },
        'fade-left'  : { x: 48 },
        'zoom-in'    : { scale: 0.88 },
        'flip-up'    : { rotateX: 18, transformPerspective: 900 }
    };

    document.querySelectorAll('[data-anim]').forEach(el => {
        const type  = el.dataset.anim || 'fade-up';
        const raw   = el.style.getPropertyValue('--anim-delay') || el.dataset.animDelay || '0';
        const delay = parseFloat(raw) || 0;
        const from  = Object.assign({ opacity: 0 }, map[type] || { y: 44 });

        gsap.fromTo(el, from, {
            opacity: 1,
            x: 0, y: 0, scale: 1, rotateX: 0,
            duration: 0.75,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
                trigger      : el,
                start        : 'top 88%',
                toggleActions: 'play none none none'
            },
            onStart: () => el.classList.add('is-visible')
        });
    });
}

/* =============================================
   6. SECTION HEADERS (tag → title → subtitle)
   ============================================= */
function initSectionHeaders() {
    document.querySelectorAll('.section__header').forEach(hdr => {
        /* Skip if any child already has [data-anim] — handled by initScrollReveal */
        if (hdr.querySelector('[data-anim]')) return;

        const tag  = hdr.querySelector('.section__tag');
        const ttl  = hdr.querySelector('.section__title');
        const sub  = hdr.querySelector('.section__subtitle');
        const els  = [tag, ttl, sub].filter(Boolean);
        if (!els.length) return;

        if (ttl) splitTextPreserveHTML(ttl);
        const words = ttl ? ttl.querySelectorAll('.split-word') : [];

        const tl = gsap.timeline({
            scrollTrigger: { trigger: hdr, start: 'top 86%', toggleActions: 'play none none none' }
        });

        if (tag) tl.fromTo(tag, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        if (ttl) {
            tl.to(ttl, { opacity: 1, y: 0, duration: 0.01 }, tag ? '-=0.4' : 0);
            if (words.length) {
                tl.fromTo(words, 
                    { opacity: 0, y: '110%', rotate: 3 }, 
                    { opacity: 1, y: '0%', rotate: 0, duration: 0.75, stagger: 0.03, ease: 'power4.out' }, 
                    tag ? '-=0.4' : 0
                );
            } else {
                tl.fromTo(ttl, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, tag ? '-=0.4' : 0);
            }
        }
        if (sub) tl.fromTo(sub, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
    });
}

/* =============================================
   7. GRID STAGGER (cards without data-anim)
   ============================================= */
function initGridStagger() {
    const grids = [
        '.games-grid',
        '.activities-grid',
        '.branches-grid',
        '.values-grid',
        '.story-visual-grid',
        '.team-grid',
        '.gallery-grid',
        '.reviews-masonry'
    ];

    grids.forEach(sel => {
        document.querySelectorAll(sel).forEach(grid => {
            /* Only target cards that don't already have [data-anim] */
            const cards = Array.from(grid.children).filter(c => !c.hasAttribute('data-anim'));
            if (!cards.length) return;

            gsap.fromTo(cards,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0,
                    duration: 0.65, stagger: 0.1, ease: 'power3.out',
                    scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none none' }
                }
            );
        });
    });
}

/* =============================================
   8. COUNTER ANIMATION
   ============================================= */
function initCounters() {
    document.querySelectorAll('.hero__stat-number').forEach(el => {
        const text   = el.textContent.trim();
        const num    = parseFloat(text.replace(/[^\d.]/g, ''));
        const suffix = text.replace(/[\d.]/g, '');
        if (!num) return;

        const obj = { v: 0 };
        gsap.to(obj, {
            v: num,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            onUpdate() {
                el.textContent = (Number.isInteger(num)
                    ? Math.round(obj.v)
                    : obj.v.toFixed(1)) + suffix;
            }
        });
    });
}

/* =============================================
   9. CTA BANNER REVEAL
   Guard: skip elements whose parent already has [data-anim]
   ============================================= */
function initCTAReveal() {
    document.querySelectorAll('.cta-banner').forEach(banner => {
        /* If the content wrapper has [data-anim], initScrollReveal handles it */
        const content = banner.querySelector('[data-anim]');
        if (content) return;

        const ttl = banner.querySelector('.cta-banner__title');
        const sub = banner.querySelector('.cta-banner__sub');
        const btn = banner.querySelectorAll('.btn');

        const els = [ttl, sub, ...btn].filter(Boolean);
        if (!els.length) return;

        const tl = gsap.timeline({
            scrollTrigger: { trigger: banner, start: 'top 82%', toggleActions: 'play none none none' }
        });
        if (ttl) tl.fromTo(ttl, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
        if (sub) tl.fromTo(sub, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
        if (btn.length) tl.fromTo(btn, { opacity: 0, y: 18, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.5, ease: 'back.out(1.4)' }, '-=0.3');
    });
}

/* =============================================
   10. ACTIVITY DETAIL REVEALS
   Guard: skip if parent wrapper already has [data-anim]
   ============================================= */
function initActivityDetail() {
    /* Rules list — only animate if parent does NOT have [data-anim] */
    const rulesWrap = document.querySelector('.activity-detail__rules');
    if (rulesWrap && !rulesWrap.hasAttribute('data-anim')) {
        const items = rulesWrap.querySelectorAll('li');
        if (items.length) {
            gsap.fromTo(items,
                { opacity: 0, x: -28 },
                {
                    opacity: 1, x: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out',
                    scrollTrigger: { trigger: rulesWrap, start: 'top 85%', toggleActions: 'play none none none' }
                }
            );
        }
    }

    /* Tip cards — only animate if parent does NOT have [data-anim] */
    const tipsWrap = document.querySelector('.activity-detail__tips');
    if (tipsWrap && !tipsWrap.hasAttribute('data-anim')) {
        const tips = tipsWrap.querySelectorAll('.activity-detail__tip-card');
        if (tips.length) {
            gsap.fromTo(tips,
                { opacity: 0, y: 28 },
                {
                    opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
                    scrollTrigger: { trigger: tipsWrap, start: 'top 85%', toggleActions: 'play none none none' }
                }
            );
        }
    }
}

/* =============================================
   11. HERO PARALLAX
   ============================================= */
function initHeroParallax() {
    const bg = document.querySelector('.hero__bg');
    if (bg) {
        gsap.to(bg, {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
        });
    }

    document.querySelectorAll('.hero__glow').forEach((glow, i) => {
        gsap.to(glow, {
            yPercent: i % 2 === 0 ? 22 : -22,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
        });
    });

    /* Inner page hero parallax */
    const pageBg = document.querySelector('.page-hero__bg');
    if (pageBg) {
        gsap.to(pageBg, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: 1 }
        });
    }
}

/* =============================================
   12. 3D CARD TILT (desktop only)
   ============================================= */
function init3DTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.game-card, .activity-card, .branch-card, .value-card, .story-visual-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
            const y = ((e.clientY - r.top)  / r.height - 0.5) * -14;
            gsap.to(card, {
                rotateY: x, rotateX: y,
                transformPerspective: 900,
                duration: 0.3, ease: 'power2.out',
                overwrite: 'auto'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0, rotateX: 0,
                duration: 0.55, ease: 'elastic.out(1, 0.5)',
                overwrite: 'auto'
            });
        });
    });
}

/* =============================================
   13. MAGNETIC BUTTONS (desktop only)
   ============================================= */
function initMagnetic() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.btn--primary, .btn--white, .btn--ghost').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r  = btn.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width  / 2);
            const dy = e.clientY - (r.top  + r.height / 2);
            gsap.to(btn, { x: dx * 0.3, y: dy * 0.3, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
        });
    });
}

/* =============================================
   14. REVIEW STARS FILL
   ============================================= */
function initStarsFill() {
    document.querySelectorAll('.review-card__stars').forEach(el => {
        if (!el.textContent.trim()) {
            el.textContent = '★★★★★';
        }
    });
    /* reviews.html full cards already have stars in HTML — no action needed */
}

/* =============================================
   15. GLOW TRACKING CARDS
   ============================================= */
function initGlowTracking() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.game-card, .activity-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* =============================================
   16. VIDEO HOVER PLAY/PAUSE
   ============================================= */
function initVideoHover() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.game-card, .activity-card').forEach(card => {
        const vid = card.querySelector('.card-hover-video');
        if (!vid) return;

        card.addEventListener('mouseenter', () => {
            vid.play().catch(() => {});
        });
        card.addEventListener('mouseleave', () => {
            vid.pause();
            vid.currentTime = 0;
        });
    });
}

/* =============================================
   INIT
   ============================================= */
(function init() {
    const isHome = !document.querySelector('.page-hero');

    initCursor();
    initStarsFill();

    if (isHome) {
        initLoader(); /* handles startHeroAnimation internally */
    } else {
        initPageHero();
    }

    window.addEventListener('load', () => {
        initHeroParallax();
        initScrollReveal();
        initSectionHeaders();
        initGridStagger();
        initCounters();
        initCTAReveal();
        initActivityDetail();
        init3DTilt();
        initMagnetic();
        initGlowTracking();
        initVideoHover();
        ScrollTrigger.refresh();
    });
})();
