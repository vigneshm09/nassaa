# NASSAA UTH HUB — Official Website

> **World's First Youth Entertainment Center** — Chennai, Tamil Nadu

A modern, fully responsive, production-ready portfolio/landing website for **NASSAA UTH HUB**, built with clean HTML5, CSS3, and vanilla JavaScript. Designed to be easily converted into a WordPress theme with minimal changes.

---

## Project Overview

NASSAA UTH HUB is a premier youth entertainment destination with three branches across Chennai, offering VR gaming, bowling, laser tag, arcade, snooker, escape rooms, PS5 lounges, and much more. This website serves as the official digital presence of the brand.

---

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, about snippet, games preview, reviews slider, branches, CTA |
| Our Games | `games.html` | Full activity listing per branch with tab filter |
| About Us | `about.html` | Brand story, mission, team, FAQs |
| Reviews | `reviews.html` | Full customer reviews grid |
| Gallery | `gallery.html` | Photo gallery (coming soon) |
| Contact Us | `contact.html` | Branch contacts, Google Maps, contact form |

---

## Tech Stack

- **HTML5** — Semantic markup (`section`, `article`, `nav`, `header`, `footer`, `address`)
- **CSS3** — Custom properties, Grid, Flexbox, Animations, Media queries (mobile-first)
- **JavaScript (ES6+)** — Vanilla JS, Intersection Observer API, Touch events
- **Google Fonts** — Bebas Neue (headings) + Inter (body)
- **No frameworks, no jQuery, no build tools required**

---

## File Structure

```
nasa-web/
├── index.html              # Homepage
├── games.html              # Our Games page
├── about.html              # About Us page
├── reviews.html            # Reviews page
├── gallery.html            # Gallery page
├── contact.html            # Contact Us page
├── README.md               # This file
└── assets/
    ├── css/
    │   └── style.css       # Main stylesheet (all pages share this)
    ├── js/
    │   └── main.js         # Main JavaScript (modular, reusable)
    ├── images/             # Image assets (optimized)
    └── videos/             # Video assets (hero background)
```

---

## Design System

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#080808` | Page background |
| `--color-surface` | `#0f0f0f` | Section backgrounds |
| `--color-card` | `#141414` | Card backgrounds |
| `--color-primary` | `#FF6A00` | Orange accent (brand color) |
| `--color-primary-light` | `#FF8C33` | Hover states |
| `--color-white` | `#FFFFFF` | Primary text |

### Typography
- **Headings:** Bebas Neue (bold, condensed)
- **Body:** Inter (readability)

### Breakpoints
| Breakpoint | Width |
|-----------|-------|
| Desktop | > 1024px |
| Tablet | ≤ 1024px |
| Mobile | ≤ 768px |
| Small | ≤ 480px |

---

## Features

- **Sticky Navigation** — Glass morphism effect on scroll, mobile hamburger menu
- **Hero Section** — Video background, ambient glow effects, scroll cue
- **Reviews Slider** — Touch/swipe support, auto-advance, responsive cards-per-view (3/2/1)
- **Scroll Animations** — Intersection Observer–powered fade-in animations
- **WhatsApp Float Button** — Fixed CTA (+91 97890 29700)
- **Scroll-to-Top Button** — Appears after scrolling 400px
- **Lazy Loading** — Images loaded on demand via Intersection Observer
- **Fully Accessible** — ARIA labels, semantic HTML, keyboard navigation
- **SEO Ready** — Meta tags, Open Graph, semantic structure

---

## Branch Locations

| Branch | Address | Phone |
|--------|---------|-------|
| Besant Nagar | 5th Avenue, Elliot's Promenade, Chennai 600090 | +91 94567 89800 |
| Marina Mall | 13/1A, OMR Marina Mall, Egattur, Chennai 603103 | +91 94567 89400 |
| ECR | East Coast Road, Injambakkam, Chennai 600115 | +91 94567 89200 |

---

## Contact & Social

| Channel | Details |
|---------|---------|
| Email | nassaauthhub@gmail.com |
| WhatsApp | +91 97890 29700 |
| Instagram | [@nassaa.in](https://www.instagram.com/nassaa.in/) |
| Facebook | [nassaayouthhub.offl](https://www.facebook.com/nassaayouthhub.offl/) |
| YouTube | [NassaaUthHub](https://www.youtube.com/c/NassaaUthHub/featured) |

---

## WordPress Conversion Guide

This site is structured to convert cleanly into a WordPress theme:

| HTML Section | WordPress Template Part |
|-------------|------------------------|
| `<nav class="navbar">` | `header.php` |
| `<footer class="footer">` | `footer.php` |
| `index.html` body | `index.php` / `front-page.php` |
| `games.html` | `page-games.php` |
| `about.html` | `page-about.php` |
| `reviews.html` | `page-reviews.php` |
| `gallery.html` | `page-gallery.php` |
| `contact.html` | `page-contact.php` |
| Game cards | Reusable block / custom post type |
| Review cards | Custom post type: Testimonials |

**Key conversion notes:**
- Replace static text with `<?php the_content(); ?>` blocks
- Convert navigation to `wp_nav_menus()`
- Use `get_template_part()` for shared components
- Register `style.css` and `main.js` via `wp_enqueue_scripts()`
- Class-based selectors (no IDs for styling) make CSS portable as-is

---

## How to Run

Simply open `index.html` in any modern browser. No build step, no server required.

For local development with live reload:
```bash
# Using VS Code Live Server extension — recommended
# Or using Python:
python -m http.server 8080
# Then open: http://localhost:8080
```

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile browsers | ✅ Full |

---

*Built for NASSAA UTH HUB — Chennai's ultimate youth entertainment destination.*
