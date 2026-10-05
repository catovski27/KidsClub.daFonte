# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static single-page marketing/enrollment site for **KidsClub.daFonte** (a nature/arts childcare project at Terra da Fonte, Mafra, run by Amálgama Associação Cultural). All user-facing content is in **European Portuguese** — keep new copy in pt-PT. Hosted on GitHub Pages; `_headers` holds security headers for a Cloudflare Pages deployment.

There is no build step, package manager, linter, or test suite. Check changes in a browser at desktop width and at phone width (~390px), and look for horizontal overflow.

**Sources of truth:** `index.html` and this file. `README.md` (pt-PT) is out of date: it still describes the old morning/afternoon schedule, the "Dia Inteiro 350€ / Meio Dia 200€" prices and a different Google Form URL. The form the site really uses is the `docs.google.com/forms/d/e/1FAIpQLSfZ…/viewform` link in `index.html`. Client material lives in `docs/Apresentação kidsclub.pdf` (presentation the content comes from) and the untracked `to do list.md` (the client's current change requests).

## Running locally

```bash
python -m http.server 8080   # or: npx serve .
```
Then open http://localhost:8080. Opening `index.html` directly also works.

## Architecture

- **`index.html`** (one large file) holds all content. After the fixed `<nav>` comes the hero (`<header id="inicio">`), then a sequence of `<section id="...">` blocks in nav order: `quemsomos`, `proposito`, `principios`, `equipa`, `espaco`, `programa`, `atividades`, `precario`, `dia-aberto`, `contactos`. Most styling is Tailwind utility classes inline. Content edits (often made via the GitHub web UI by non-developers) almost always touch only this file.
- **Tailwind runs from the Play CDN** (`cdn.tailwindcss.com`) with an inline `tailwind.config` in `<head>` defining the brand colors (`verdeFolha`, `verdeSuave`, `terracota`, `amareloSol`, `cremeFundo`, `castanhoTexto`) and font families (`fredoka`, `quicksand`, `sans` = Plus Jakarta Sans). The same palette is mirrored as CSS variables (`--verde-folha`, etc.) in `css/main.css` — change both together.
- **`css/main.css`**: design tokens plus custom styles/animations Tailwind can't express. `--terracota-texto` (#A9533A) and `--verde-folha-escuro` are darker variants for small text and button backgrounds, where the brand terracotta #D97757 fails contrast; keep #D97757 for decoration only. The file has several duplicated blocks from earlier iterations (e.g. `.schedule-tab`, `@keyframes sun-spin`, `eq-bounce-*`), so grep for every occurrence before editing a rule: the last one wins.
- **Brand name colors** (as in the logo): every visible "KidsClub.daFonte" is split into "KidsClub" (green, `.brand-kids` or inherited `#4A6B53`), ".da" (`.brand-da`, `--terracota-texto`) and "Fonte" (`.brand-fonte`, `--amarelo-fonte` #E9A90F). On the dark footer wrap it in `.brand-on-dark` for lighter tints. Use the same markup when the name appears in new copy.
- **Program colors** follow the brand: Programa 1 green, Programa 2 terracota, Programa 3 yellow (`--amarelo-fonte`, with `--amarelo-texto` for readable text). They're set through `--accent` / `--accent-soft` / `--accent-text` on `.programa-panel--{green,terracota,sol}`, `.price-card--{green,terracota,sol}`, the tabs' `data-accent` and the hero `.hero-program--*` shortcuts.
- **`js/main.js`**: nearly everything lives inside one `DOMContentLoaded` handler — GSAP/ScrollTrigger animations, the program tabs in `programa` (`.schedule-tab` buttons with `aria-controls` pointing at `#programa-panel-1..3`), activity filters + Web Audio sounds, photo marquee (`initFaixaMarquee` fills every `.photo-marquee-track`; today there is only one, in `principios`), gallery lightbox, active-nav tracking, ambient music (synthesized via Web Audio, no audio files), and easter eggs. Only `copyToClipboard` is global, because it's called from inline `onclick` attributes in the HTML.
- **Programs and prices**: three programs (1 Bebés na Natureza, 2 Pequenos Exploradores, 3 Floresta em Família). Details sit in the `programa` tabs and a summary in the 3 `.price-card`s of `precario`. The cards are deliberately equal (white, only the accent color changes) so no program is emphasized, and `precario` has a single enrollment button in the banner above the cards. Prices are plain HTML, so when they change, update both sections.
- **Enrollment is Google Forms only** (the e-mail modal was removed at the client's request). Every "Inscrição" button is a link to the same Google Form, opening in a new tab. There is no backend.
- **"Quem somos" video**: a YouTube Short (`DeFuq86yIYw`) embedded through `youtube-nocookie.com` at the end of the section: a `.promo-block` card with the title "Veja aqui como é o KidsClub.daFonte", one line of text and a `.promo-yt-card` link on the left, and the 9:16 `.promo-video` inside a phone frame (`.promo-phone`) on the right. The client asked for no decorative text chips there.
- **Hero content is decided by the client**: brand name, the motto on one line with `|` separators as in the logo ("cuidar e educar | natureza e arte | brincar e crescer", each phrase in its own color), the short text about Terra da Fonte / Amalgama, the Saint-Exupéry quote, the facts row (ages, hours, location), the enrollment card (`#inscricao`: period note with a pulsing dot, "Formulário de Inscrição" + "Conhecer os programas" buttons, and 🌱🌿🌲 shortcuts whose `data-programa-tab` opens the matching tab), and the `Logo1.png` illustration (image only, no decorations around it, by client request). Don't remove any of these without asking.
- **Enrollment buttons** use `.btn-primary` / `.btn-secondary` (defined in `css/main.css`) and all point to the Google Form. The nav "Inscrição" button links to `#inscricao`, the hero button block.
- **Small UI extras in `js/main.js`**: reading-progress bar under the nav (`#scroll-progress`), "voltar ao topo" button (`#back-to-top`), hero illustration tilt on mouse move (desktop only), and a re-scroll to `location.hash` on `load`, because the Tailwind CDN and images shift the layout after the browser's first anchor jump.
- **Lightbox**: one modal serves two galleries. Elements with class `space-card` (gallery `espaco`) or `album-card` (gallery `dia-aberto`, set via `data-gallery`) open it from their `data-img` / `data-title` / `data-desc` attributes; prev/next, arrow keys, Esc and swipe step through items of the same gallery. Badge text per gallery lives in `galleryBadges` in `js/main.js`.
- **Easter eggs** (top of `js/main.js`, credit to the site author "Vullkano"): ASCII crab (same drawing) in the console (`crabAsciiArt`) and in an HTML comment at the end of `index.html`; a single click on the footer copyright line (the "© 2026 KidsClub.daFonte…" text) starts the crab family walk (`crabFamilyWalk` + `playCrabWalkSound`: a sand strip rises at the bottom, a big crab and three little ones walk in, stop in the middle to say hello with a few leaves floating up, then walk off, ~7 s, with a soft pentatonic melody). The line is a `<button class="footer-secret">` with a dotted underline (no crab icon, by client request) so people see it's clickable; the credit must stay hidden (no visible "made by" text); 5 clicks on a logo rains nature confetti; the Konami code (↑↑↓↓←→←→BA) triggers a crab parade. All respect `prefers-reduced-motion` and share one `AudioContext`. Keep them when editing.
- **Animation tone**: the client wants every animation calm and minimal ("calma e paz com a natureza"): slow `sine`/`power1` eases, small movements, no shaking, flashing, elastic/bounce overshoot, sirens or loud sounds. Keep new animations in that spirit and always respect `prefers-reduced-motion`.
- External libs via CDN: Lucide icons (`lucide.createIcons()` must run after icon markup is added), GSAP 3.12.5 + ScrollTrigger, Google Fonts.

## Cache busting

`index.html` loads `css/main.css?v=...` and `js/main.js?v=...` with a shared version string (e.g. `20260829_12`). Bump both query strings whenever CSS or JS changes so returning visitors don't get stale files.

## Images

Photos were downscaled to at most 2000px on the long edge (originals are in git history). Keep new photos at a similar size, and add `loading="lazy" decoding="async"` to any `<img>` below the hero.

## Assets

Images live in `assets/images/` in numbered folders matching the site sections (`1.Quem_somos`, `4.Equipa`, `5.Espaço`, ...). Some file and folder names contain accents or spaces (`5.Espaço`, `Sílvia.jpeg`, `Quem_ somos1.png`), so reference them exactly as named.
