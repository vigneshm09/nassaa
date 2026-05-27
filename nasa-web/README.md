# NASSAA UTH HUB — Website

Official website for NASSAA UTH HUB, Chennai's premier entertainment zone featuring arcade games, laser tag, VR experiences, bowling, bumper cars, and more across 3 branches (Besant Nagar, ECR, Marina Mall).

---

## Project Structure

```
nasa-web/
├── index.html                     # Homepage
├── about.html                     # About Us
├── contact.html                   # Contact & Maps
├── gallery.html                   # Photo Gallery
├── games.html                     # Games Overview
├── branches.html                  # All Branches
├── reviews.html                   # Customer Reviews
├── 404.html                       # Custom 404 page
├── branch-besant-nagar.html       # Besant Nagar branch page
├── branch-ecr.html                # ECR branch page
├── branch-marina-mall.html        # Marina Mall branch page
├── activity-arcade.html           # Arcade activity page
├── activity-bowling.html          # Bowling activity page
├── activity-bumper-car.html       # Bumper car activity page
├── activity-cafe.html             # Cafe activity page
├── activity-cricket.html          # Cricket activity page
├── activity-escape.html           # Escape room activity page
├── activity-floor-lava.html       # Floor is Lava activity page
├── activity-futsal.html           # Futsal activity page
├── activity-laser-maze.html       # Laser maze activity page
├── activity-laser-tag.html        # Laser tag activity page
├── activity-ps5.html              # PS5 gaming activity page
├── activity-racing-simulator.html # Racing simulator activity page
├── activity-snooker.html          # Snooker activity page
├── activity-vr.html               # VR experience activity page
├── robots.txt                     # Search engine crawler rules
├── vercel.json                    # Vercel deployment config
└── assets/
    ├── css/
    │   └── style.css              # Main stylesheet
    ├── js/
    │   ├── main.js                # Core JS (slider, FAB, nav)
    │   └── gsap-animations.js     # GSAP scroll animations
    ├── images/                    # Static images & icons
    └── videos/
        └── hero-bg.mp4            # Homepage hero background video
```

---

## Technologies

- **HTML5 / CSS3 / Vanilla JS** — no frameworks
- **GSAP + ScrollTrigger** — scroll-driven animations
- **Font Awesome 6** — icons
- **Google Fonts** — Orbitron + Inter
- **Vercel** — hosting & deployment

---

## SEO Optimizations

Every HTML page includes:

- **Canonical URLs** — `<link rel="canonical">` to prevent duplicate content penalties
- **Open Graph tags** — `og:title`, `og:description`, `og:image`, `og:url`, `og:type` for rich social previews (Facebook, WhatsApp, LinkedIn)
- **Twitter Card tags** — `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` for Twitter/X previews
- **JSON-LD structured data** — `LocalBusiness` schema on branch pages, `EntertainmentBusiness` on the homepage, `BreadcrumbList` on activity pages — enables Google rich results (star ratings, address, phone, hours in SERPs)
- **Meta descriptions** — unique, keyword-rich descriptions on every page
- **robots.txt** — explicitly allows all crawlers, references the sitemap
- **Proper heading hierarchy** — single `<h1>` per page, logical `h2`/`h3` structure

---

## Performance Optimizations

### Images
- `loading="lazy"` on all non-hero images — defers off-screen images until needed
- `width` and `height` attributes on `<img>` tags — prevents Cumulative Layout Shift (CLS) by reserving space before images load
- `fetchpriority="high"` on the hero video — signals the browser to prioritise the LCP element

### Video
- `<link rel="preload" as="video">` in `<head>` of `index.html` — starts fetching the hero video before the parser reaches the `<video>` tag
- Hero video pauses automatically when the browser tab is hidden (via `visibilitychange` event) — saves battery and CPU on mobile

> **Recommended:** Re-encode `hero-bg.mp4` with FFmpeg to reduce file size from ~32 MB to ~3–4 MB:
> ```
> ffmpeg -i hero-bg.mp4 -vcodec libx264 -crf 28 -preset slow -vf scale=1280:-2 hero-bg-optimized.mp4
> ffmpeg -i hero-bg.mp4 -vcodec libvpx-vp9 -crf 33 -b:v 0 -vf scale=1280:-2 hero-bg.webm
> ```
> Then serve both formats in `index.html` for best cross-browser coverage and fastest LCP score.

### CSS & Rendering
- `will-change: transform` on hero glow and scroll-line elements — promotes to GPU compositor layer, eliminating paint jank during animations
- `will-change: opacity` on the film grain overlay — same GPU promotion benefit
- Film grain `body::after` animation is disabled for users with `prefers-reduced-motion: reduce` — respects accessibility preferences and saves GPU
- `transition` properties are listed explicitly (no `transition: all`) on FAB buttons — prevents unintended animations when `env(safe-area-inset-bottom)` resolves after initial paint

### JavaScript
- Reviews slider auto-advance uses a visibility-aware `setTimeout` chain instead of `setInterval` — skips ticks when the tab is hidden, preventing background battery/CPU drain
- Scroll and touch event listeners use `{ passive: true }` — unblocks the browser's scroll pipeline

---

## Mobile & Responsive

- **`viewport-fit=cover`** on all pages — allows content to extend into iPhone notch / Dynamic Island / home indicator safe areas
- **`env(safe-area-inset-bottom)`** on WhatsApp FAB and scroll-to-top button — keeps them above the iOS home indicator and Android gesture navigation bar, with a CSS cascade fallback for browsers that don't support `env()`
- Fully tested at 360px, 390px (iPhone 14), 430px (iPhone 14 Pro Max), 768px (tablet), and 1024px+ (desktop)
- No horizontal scroll at any breakpoint
- FAB buttons (`56×56px` on desktop, `50×50px` on 360px screens) meet WCAG minimum tap target size

---

## Accessibility

- All Google Maps `<iframe>` embeds have a `title` attribute — required for screen readers
- Reduced-motion support: film grain animation disabled when OS accessibility setting is active
- Sufficient colour contrast on all text elements
- All interactive elements reachable by keyboard

---

## Branches

| Branch | Address |
|--------|---------|
| Besant Nagar | 5th Avenue, Besant Nagar, Chennai 600090 |
| ECR | East Coast Road, Chennai |
| Marina Mall | Marina Mall, Chennai |

**Phone:** +91 99400 54321  
**Email:** info@nassaauthhub.com  
**Hours:** Mon–Sun, 10:00 AM – 10:00 PM

---

## Deployment

Deployed on **Vercel**. `vercel.json` configures:
- Clean URL routing (no `.html` extension in URLs)
- Custom 404 redirect to `404.html`
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`)
- Long-term caching for static assets in the `assets/` folder
