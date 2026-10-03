# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static single-page marketing/enrollment site for **KidsClub.daFonte** (a nature/arts childcare project at Terra da Fonte, Mafra, run by Amálgama Associação Cultural). All user-facing content is in **European Portuguese** — keep new copy in pt-PT. Hosted on GitHub Pages; `_headers` holds security headers for a Cloudflare Pages deployment.

There is no build step, package manager, linter, or test suite.

## Running locally

```bash
python -m http.server 8080   # or: npx serve .
```
Then open http://localhost:8080. Opening `index.html` directly also works.

## Architecture

- **`index.html`** (~2650 lines) holds all content. After the fixed `<nav>` comes the hero (`<header id="inicio">`), then a sequence of `<section id="...">` blocks in nav order: `quemsomos`, `proposito`, `principios`, `equipa`, `espaco`, `programa`, `atividades`, `precario`, `dia-aberto`, `contactos`. Most styling is Tailwind utility classes inline. Content edits (often made via the GitHub web UI by non-developers) almost always touch only this file.
- **Tailwind runs from the Play CDN** (`cdn.tailwindcss.com`) with an inline `tailwind.config` in `<head>` defining the brand colors (`verdeFolha`, `verdeSuave`, `terracota`, `amareloSol`, `cremeFundo`, `castanhoTexto`) and font families (`fredoka`, `quicksand`, `sans` = Plus Jakarta Sans). The same palette is mirrored as CSS variables (`--verde-folha`, etc.) in `css/main.css` — change both together.
- **`css/main.css`**: design tokens plus custom styles/animations Tailwind can't express. `--terracota-texto` (#A9533A) and `--verde-folha-escuro` are darker variants for small text and button backgrounds, where the brand terracotta #D97757 fails contrast; keep #D97757 for decoration only.
- **`js/main.js`**: nearly everything lives inside one `DOMContentLoaded` handler — GSAP/ScrollTrigger animations, schedule morning/afternoon toggle (`programa`), activity filters + Web Audio sounds, photo marquee (`initFaixaMarquee`), gallery lightbox, active-nav tracking, ambient music (synthesized via Web Audio, no audio files), easter eggs, and the enrollment modal. Only `copyEmailSummary` and `copyToClipboard` are global, because they're called from inline `onclick` attributes in the HTML.
- **Enrollment flow**: buttons with `data-plan` open a modal; `calculatePrice()` uses hardcoded prices (Dia Inteiro 350€, Meio Dia 200€ per child). Submitting builds a `mailto:kidsclub.dafonte@gmail.com` link with a form summary — there is no backend. The official enrollment form is a linked Google Form. If prices change, update both the `precario` section in `index.html` and `calculatePrice()` in `js/main.js`.
- **Hero content is decided by the client**: brand name, the three-line motto, the short text about Terra da Fonte / Amalgama, the Saint-Exupéry quote, the facts row (ages, hours, location), the enrollment buttons with the enrollment-period note, and the `Logo1.png` illustration. Don't remove any of these without asking.
- **Enrollment buttons** use `.btn-primary` / `.btn-secondary` (defined in `css/main.css`) and the same labels everywhere: "Fazer inscrição online" (Google Form, new tab) and "Inscrever por e-mail" (opens the modal). The nav "Inscrição" button links to `#inscricao`, the hero button block.
- **Small UI extras in `js/main.js`**: reading-progress bar under the nav (`#scroll-progress`), "voltar ao topo" button (`#back-to-top`), hero illustration tilt on mouse move (desktop only), and a re-scroll to `location.hash` on `load`, because the Tailwind CDN and images shift the layout after the browser's first anchor jump.
- **Lightbox**: one modal serves two galleries. Elements with class `space-card` (gallery `espaco`) or `album-card` (gallery `dia-aberto`, set via `data-gallery`) open it from their `data-img` / `data-title` / `data-desc` attributes; prev/next, arrow keys, Esc and swipe step through items of the same gallery. Badge text per gallery lives in `galleryBadges` in `js/main.js`.
- **Easter eggs** (top of `js/main.js`, credit to the site author "Vullkano"): ASCII crab in the console and in an HTML comment at the end of `index.html`; 3 clicks on the footer copyright line send a crab walking across the screen (the credit must stay hidden: no visible "made by" text); 5 clicks on a logo rains nature confetti; the Konami code (↑↑↓↓←→←→BA) triggers a crab parade. All respect `prefers-reduced-motion` and share one `AudioContext`. Keep them when editing.
- External libs via CDN: Lucide icons (`lucide.createIcons()` must run after icon markup is added), GSAP 3.12.5 + ScrollTrigger, Google Fonts.

## Cache busting

`index.html` loads `css/main.css?v=...` and `js/main.js?v=...` with a shared version string (e.g. `20260829_12`). Bump both query strings whenever CSS or JS changes so returning visitors don't get stale files.

## Images

Photos were downscaled to at most 2000px on the long edge (originals are in git history). Keep new photos at a similar size, and add `loading="lazy" decoding="async"` to any `<img>` below the hero.

## Assets

Images live in `assets/images/` in numbered folders matching the site sections (`1.Quem_somos`, `4.Equipa`, `5.Espaço`, ...). Some file and folder names contain accents or spaces (`5.Espaço`, `Sílvia.jpeg`, `Quem_ somos1.png`), so reference them exactly as named.
