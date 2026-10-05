/**
 * KidsClub.daFonte - Main Application Logic
 * Integrates GSAP animations, program tabs, activity filters,
 * photo marquees, gallery lightbox and easter eggs.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 3. 💻 Assinatura Completa na Consola (F12)
  const crabAsciiArt = [
    "     _                           _",
    "    ( \\___                   ___/ )",
    "     \\__  \\    .-.   .-.    /  __/",
    "        \\  \\  ( o ) ( o )  /  /",
    "         \\  '._`-'   `-'_.'  /",
    "          '._    \\___/    _.'",
    "          /  `-._______.-'  \\",
    "         / /  / /     \\ \\  \\ \\",
    "        /_/  /_/       \\_\\  \\_\\",
    "",
    "        🦀  Vullkano was here  🦀",
  ].join('\n');
  console.log(
    `%c\n${crabAsciiArt}\n`,
    "color: #D97757; font-family: monospace; font-weight: bold; font-size: 13px; line-height: 1.3;"
  );
  console.log(
    "%c🌿 KidsClub.daFonte • Terra da Fonte, Mafra 🌟",
    "color: #4A6B53; font-weight: bold; font-size: 11px; padding: 2px 0;"
  );

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Easter Eggs Audio Synthesizer (Web Audio API)
  // Um único AudioContext partilhado: os browsers limitam quantos podem existir em simultâneo.
  let easterEggCtx = null;

  function getEasterEggCtx() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!easterEggCtx) easterEggCtx = new AudioCtx();
    if (easterEggCtx.state === 'suspended') easterEggCtx.resume();
    return easterEggCtx;
  }

  function playTone(ctx, { type = 'sine', from, to, start, duration, volume }) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, start);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, start + duration);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
  }

  function playEasterEggSound(type) {
    try {
      const ctx = getEasterEggCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'crab') {
        // Som caranguejo: duplo pop alegre e suave
        playTone(ctx, { from: 380, to: 760, start: now, duration: 0.12, volume: 0.2 });
        playTone(ctx, { from: 520, to: 1040, start: now + 0.14, duration: 0.14, volume: 0.22 });
      } else if (type === 'step') {
        // Passinho do caranguejo
        playTone(ctx, { type: 'triangle', from: 900 + Math.random() * 200, start: now, duration: 0.05, volume: 0.04 });
      } else if (type === 'confetti') {
        // Som confetes / magia: arpeggio brilhante de harpa e sinos
        [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98].forEach((freq, idx) => {
          playTone(ctx, { type: 'triangle', from: freq, start: now + idx * 0.08, duration: 0.6, volume: 0.07 });
        });
      } else if (type === 'fanfare') {
        // Fanfarra do código secreto
        [392, 523.25, 659.25, 783.99, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          playTone(ctx, { type: 'triangle', from: freq, start: now + idx * 0.14, duration: 0.3, volume: 0.06 });
        });
      }
    } catch (e) {
      // Ignora silenciosamente se o áudio não for permitido pelo browser
    }
  }

  // 1. 🦀 Passeio da família caranguejo (o caranguejo Vullkano e os filhotes)
  //    (segredo: um clique no texto de copyright do rodapé, o que começa por "©")
  const footerTrigger = document.getElementById('footer-copyright-trigger');
  let crabIsWalking = false;

  const crabMessages = [
    'Vullkano was here!',
    'Clac clac! Bom dia na Terra da Fonte',
  ];
  let crabMessageIndex = 0;

  function spawnCrab({ bottom = 18, duration = 5.5, delay = 0, message = null, size = 44 } = {}) {
    const crab = document.createElement('div');
    crab.className = 'walking-crab';
    crab.setAttribute('aria-hidden', 'true');
    crab.style.bottom = `${bottom}px`;
    crab.style.fontSize = `${size}px`;
    if (message) {
      const bubble = document.createElement('span');
      bubble.className = 'walking-crab-bubble';
      bubble.textContent = message;
      crab.appendChild(bubble);
    }
    const body = document.createElement('span');
    body.className = 'walking-crab-body';
    body.textContent = '🦀';
    crab.appendChild(body);
    document.body.appendChild(crab);

    const bubble = crab.querySelector('.walking-crab-bubble');

    if (reduceMotion || !window.gsap) {
      // Sem animação: aparece parado no canto, com o balão visível, e desaparece
      crab.style.left = '16px';
      if (bubble) bubble.style.opacity = '1';
      setTimeout(() => crab.remove(), 3500);
      return;
    }

    gsap.set(crab, { x: window.innerWidth + 40 });
    const tl = gsap.timeline({ delay, onComplete: () => crab.remove() });
    // Entra pela direita, para a meio para "falar" e sai pela esquerda
    tl.to(crab, { x: window.innerWidth * 0.42, duration: duration * 0.4, ease: 'none' });
    if (bubble) {
      tl.to(bubble, { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' })
        .to({}, { duration: 1.6 })
        .to(bubble, { autoAlpha: 0, duration: 0.2 });
    }
    tl.to(crab, { x: -(size * 3 + 260), duration: duration * 0.6, ease: 'none' });
  }

  // Melodia suave do passeio (escala pentatónica, como uma marimba ao longe)
  function playCrabWalkSound() {
    try {
      const ctx = getEasterEggCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      [523.25, 587.33, 659.25, 783.99, 659.25, 880].forEach((freq, i) => {
        playTone(ctx, { from: freq, start: now + 2.4 + i * 0.22, duration: 0.6, volume: 0.07 });
      });
    } catch (e) {
      // Sem áudio, o passeio continua em silêncio
    }
  }

  // 🦀 Passeio da família caranguejo: sobe uma faixa de areia, a família atravessa o ecrã,
  // para a meio para cumprimentar (com folhinhas a subir) e segue caminho (~7 segundos)
  function crabFamilyWalk() {
    const W = window.innerWidth;
    const message = crabMessages[crabMessageIndex++ % crabMessages.length];

    const stage = document.createElement('div');
    stage.className = 'crab-walk';
    stage.setAttribute('aria-hidden', 'true');
    stage.innerHTML = `
      <svg class="crab-walk-shore" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,40 C200,10 400,70 600,40 C800,10 1000,70 1200,40 L1200,120 L0,120 Z"></path>
      </svg>
      <div class="crab-walk-family">
        <span class="crab-walk-bubble"></span>
        <span class="crab-walk-crab crab-walk-crab--big">🦀</span>
        <span class="crab-walk-crab">🦀</span>
        <span class="crab-walk-crab">🦀</span>
        <span class="crab-walk-crab">🦀</span>
      </div>
    `;
    document.body.appendChild(stage);
    stage.querySelector('.crab-walk-bubble').textContent = message;

    const shore = stage.querySelector('.crab-walk-shore');
    const family = stage.querySelector('.crab-walk-family');
    const bubble = stage.querySelector('.crab-walk-bubble');
    const crabs = stage.querySelectorAll('.crab-walk-crab');
    const familyWidth = family.offsetWidth;

    // Folhinhas que sobem devagar quando a família para
    const leaves = ['🍃', '🌿', '🌸', '🍃', '🌼'].map((icon) => {
      const leaf = document.createElement('span');
      leaf.className = 'crab-walk-leaf';
      leaf.textContent = icon;
      stage.appendChild(leaf);
      return leaf;
    });

    gsap.set(shore, { yPercent: 100 });
    gsap.set(family, { x: W + 20 });
    gsap.set(bubble, { autoAlpha: 0, y: 6 });
    gsap.set(leaves, { left: W / 2, bottom: 70, autoAlpha: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        stage.remove();
        crabIsWalking = false;
      },
    });

    // Passinhos: cada caranguejo balança ligeiramente, desencontrado dos outros
    const steps = gsap.to(crabs, {
      y: -3,
      rotation: 4,
      duration: 0.22,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.08,
    });

    tl.to(shore, { yPercent: 0, duration: 0.8, ease: 'power2.out' }, 0)
      // Entram pela direita e param a meio
      .to(family, { x: (W - familyWidth) / 2, duration: 2.2, ease: 'power1.out' }, 0.3)
      .add(() => steps.pause(), 2.5)
      .to(crabs, { y: 0, rotation: 0, duration: 0.2 }, 2.5)
      // Cumprimentam: o grande acena, os pequenos dão um saltinho em sequência
      .to(bubble, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 2.6)
      .to(crabs[0], { rotation: -10, duration: 0.25, repeat: 3, yoyo: true, ease: 'sine.inOut' }, 2.7)
      .to([crabs[1], crabs[2], crabs[3]], { y: -10, duration: 0.2, repeat: 1, yoyo: true, ease: 'sine.out', stagger: 0.15 }, 2.8);

    leaves.forEach((leaf, i) => {
      tl.to(leaf, {
        keyframes: [
          { autoAlpha: 1, duration: 0.3 },
          { x: (i - 2) * 40, y: -120 - i * 12, rotation: (i - 2) * 20, duration: 1.8, ease: 'sine.out' },
          { autoAlpha: 0, duration: 0.4 },
        ],
      }, 2.8 + i * 0.12);
    });

    // Despedem-se e seguem caminho para a esquerda
    tl.to(bubble, { autoAlpha: 0, duration: 0.3 }, 4.6)
      .add(() => steps.resume(), 4.7)
      .to(family, { x: -familyWidth - 20, duration: 2, ease: 'power1.in' }, 4.7)
      .to(shore, { yPercent: 100, duration: 0.8, ease: 'power2.in' }, 6.2)
      .add(() => steps.kill());
  }

  function showVullkanoCrab() {
    if (crabIsWalking) return;
    crabIsWalking = true;

    if (reduceMotion || !window.gsap) {
      // Movimento reduzido: só o caranguejo parado com o balão
      playEasterEggSound('crab');
      spawnCrab({ message: crabMessages[crabMessageIndex++ % crabMessages.length] });
      setTimeout(() => { crabIsWalking = false; }, 3500);
      return;
    }

    playCrabWalkSound();
    crabFamilyWalk();
  }
  if (footerTrigger) {
    footerTrigger.addEventListener('click', showVullkanoCrab);
  }

  // 2. 🍃 Chuva de Natureza & Confetes (5 cliques no Logo)
  const logoTriggers = [
    document.getElementById('navbar-logo-trigger'),
    document.getElementById('hero-logo-trigger')
  ].filter(Boolean);

  let logoClickCount = 0;
  let logoClickTimer = null;

  function triggerNatureConfetti() {
    playEasterEggSound('confetti');
    if (reduceMotion) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'fixed inset-0 pointer-events-none z-50 overflow-hidden';
    document.body.appendChild(particlesContainer);

    // Folhas e flores a cair devagar, a baloiçar como no outono
    const icons = ['🍃', '🌿', '🌸', '🌼', '🍀'];
    const particleCount = window.innerWidth < 640 ? 12 : 20;

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      const icon = icons[Math.floor(Math.random() * icons.length)];
      p.innerText = icon;
      p.style.position = 'absolute';
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = '-40px';
      p.style.fontSize = `${16 + Math.random() * 12}px`;
      p.style.opacity = '1';
      p.style.userSelect = 'none';
      particlesContainer.appendChild(p);

      const duration = 5 + Math.random() * 2.5;
      const delay = Math.random() * 1.2;
      const sway = 25 + Math.random() * 35;
      const rotation = (Math.random() - 0.5) * 120;

      if (window.gsap) {
        gsap.to(p, { y: window.innerHeight + 80, rotation, duration, delay, ease: 'none' });
        gsap.to(p, { x: sway, duration: duration / 4, delay, repeat: 3, yoyo: true, ease: 'sine.inOut' });
      } else {
        p.style.transition = `transform ${duration}s ease, opacity ${duration}s ease`;
        p.style.transform = `translateY(${window.innerHeight + 80}px) rotate(${rotation}deg)`;
      }
    }

    setTimeout(() => {
      particlesContainer.remove();
    }, 9000);
  }

  logoTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      logoClickCount++;
      if (logoClickTimer) clearTimeout(logoClickTimer);
      logoClickTimer = setTimeout(() => {
        logoClickCount = 0;
      }, 2000);

      if (logoClickCount >= 5) {
        logoClickCount = 0;
        triggerNatureConfetti();
      }
    });
  });

  // 3. 🎮 Código secreto (↑ ↑ ↓ ↓ ← → ← → B A): desfile de caranguejos
  const konamiSequence = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let konamiPosition = 0;

  function triggerCrabParade() {
    playEasterEggSound('fanfare');
    triggerNatureConfetti();
    // Uma fila tranquila de caranguejos ao longo do fundo do ecrã
    const count = window.innerWidth < 640 ? 4 : 6;
    for (let i = 0; i < count; i++) {
      spawnCrab({
        bottom: 18,
        duration: 7,
        delay: i * 0.45,
        size: i === 0 ? 40 : 28,
        message: i === 0 ? 'Desfile dos caranguejos 🦀' : null,
      });
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input, textarea, select')) return;
    const key = (e.key || '').toLowerCase();
    if (key === konamiSequence[konamiPosition]) {
      konamiPosition++;
    } else {
      konamiPosition = key === konamiSequence[0] ? 1 : 0;
    }
    if (konamiPosition === konamiSequence.length) {
      konamiPosition = 0;
      triggerCrabParade();
    }
  });

  console.log(
    '%cPsst… há segredos escondidos neste site. Experimenta ↑ ↑ ↓ ↓ ← → ← → B A 🦀',
    'color: #3D342F; font-size: 11px;'
  );

  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Sticky Header Shadow on Scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-md', 'bg-opacity-95');
    } else {
      navbar.classList.remove('shadow-md');
    }
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    const setMenuOpen = (open) => {
      mobileMenu.classList.toggle('hidden', !open);
      mobileMenuBtn.setAttribute('aria-expanded', String(open));
      mobileMenuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      mobileMenuBtn.querySelector('.menu-icon-open')?.classList.toggle('hidden', open);
      mobileMenuBtn.querySelector('.menu-icon-close')?.classList.toggle('hidden', !open);
    };

    mobileMenuBtn.addEventListener('click', () => {
      setMenuOpen(mobileMenu.classList.contains('hidden'));
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        setMenuOpen(false);
        mobileMenuBtn.focus();
      }
    });
    window.matchMedia('(min-width: 1280px)').addEventListener('change', (e) => {
      if (e.matches) setMenuOpen(false);
    });
  }

  // GSAP Animations setup (Otimizado: Instantâneo e Fluido no Telemóvel)
  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;

    gsap.utils.toArray('.gsap-reveal').forEach((elem) => {
      gsap.fromTo(
        elem,
        { opacity: 0, y: isMobile ? 12 : 24 },
        {
          opacity: 1,
          y: 0,
          duration: isMobile ? 0.5 : 0.8,
          ease: 'sine.out',
          scrollTrigger: {
            trigger: elem,
            start: isMobile ? 'top 92%' : 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });

    gsap.utils.toArray('.gsap-stagger-container').forEach((container) => {
      const cards = container.querySelectorAll('.gsap-stagger-item');
      gsap.fromTo(
        cards,
        { opacity: 0, y: isMobile ? 8 : 15 },
        {
          opacity: 1,
          y: 0,
          duration: isMobile ? 0.22 : 0.35,
          stagger: isMobile ? 0.03 : 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: isMobile ? 'top 92%' : 'top 88%',
            once: true,
          },
        }
      );
    });
  }

  // --- MODALIDADES: SEPARADORES DOS 3 PROGRAMAS ---
  const scheduleTabs = Array.from(document.querySelectorAll('.schedule-tab'));

  function selectProgramaTab(tab, focus = false) {
    if (tab.classList.contains('active')) return;

    scheduleTabs.forEach((t) => {
      t.classList.remove('active', 'bg-[#4A6B53]', 'text-white', 'shadow-xs');
      t.classList.add('bg-transparent', 'text-[#3D342F]');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.classList.add('hidden');
    });

    tab.classList.add('active', 'bg-[#4A6B53]', 'text-white', 'shadow-xs');
    tab.classList.remove('bg-transparent', 'text-[#3D342F]');
    tab.setAttribute('aria-selected', 'true');
    tab.removeAttribute('tabindex');
    if (focus) tab.focus();

    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (!panel) return;
    panel.classList.remove('hidden');
    if (window.gsap && !reduceMotion) {
      gsap.fromTo(panel, { opacity: 0.15, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    }
  }

  scheduleTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectProgramaTab(tab));
    // Setas esquerda/direita mudam de separador (padrão ARIA de tabs)
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const step = e.key === 'ArrowRight' ? 1 : -1;
      selectProgramaTab(scheduleTabs[(i + step + scheduleTabs.length) % scheduleTabs.length], true);
    });
  });

  // Atalhos do topo (🌱 🌿 🌲): abrem o separador do programa escolhido antes de descer
  document.querySelectorAll('[data-programa-tab]').forEach((link) => {
    link.addEventListener('click', () => {
      const tab = document.getElementById(link.getAttribute('data-programa-tab'));
      if (tab) selectProgramaTab(tab);
    });
  });

  // Activity Categories Filter with GSAP Stagger Animation
  const filterBtns = document.querySelectorAll('.activity-filter-btn');
  const activityItems = document.querySelectorAll('.activity-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;

      filterBtns.forEach((b) => {
        b.classList.remove('active', 'bg-[#4A6B53]', 'text-white', 'shadow-xs');
        b.classList.add('bg-transparent', 'text-[#3D342F]');
      });
      btn.classList.add('active', 'bg-[#4A6B53]', 'text-white', 'shadow-xs');
      btn.classList.remove('bg-transparent', 'text-[#3D342F]');

      const category = btn.getAttribute('data-filter');
      const visibleItems = [];

      activityItems.forEach((item) => {
        const itemCat = item.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
          item.classList.remove('hidden');
          item.classList.add('flex');
          visibleItems.push(item);
        } else {
          item.classList.add('hidden');
          item.classList.remove('flex');
        }
      });

      if (window.gsap && visibleItems.length > 0) {
        gsap.fromTo(
          visibleItems,
          { opacity: 0.2, scale: 0.96, y: 12 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, stagger: 0.03, ease: 'power2.out' }
        );
      }
    });
  });

  // --- ATIVIDADES TERRA DA FONTE: 15 SONS ÚNICOS & ANIMAÇÃO LÚDICA ---
  let activityAudioCtx = null;

  function getActivityAudioContext() {
    if (!activityAudioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) activityAudioCtx = new AudioContextClass();
    }
    if (activityAudioCtx && activityAudioCtx.state === 'suspended') {
      activityAudioCtx.resume();
    }
    return activityAudioCtx;
  }

  // 15 Sound Synthesizer Presets exclusivos para cada atividade
  const activitySoundEffects = [
    // 01: Clube Diário -> Acorde acolhedor de boas-vindas
    (ctx) => {
      [523.25, 659.25].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0.16, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35 + i * 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + 0.36 + i * 0.05);
      });
    },
    // 02: Oficinas Criativas -> Pincelada mágica pop
    (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.26);
    },
    // 03: Música & Ritmo -> Arpejo musical rápido (Dó-Mi-Sol-Dó)
    (ctx) => {
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.045);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2 + i * 0.045);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.045);
        osc.stop(ctx.currentTime + 0.22 + i * 0.045);
      });
    },
    // 04: Yoga Infantil -> Taça tibetana zen relaxante
    (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.72);
    },
    // 05: Contos & Histórias -> Glockenspiel de magia de fadas
    (ctx) => {
      [880, 1174.66, 1396.91].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.14, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3 + i * 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + 0.32 + i * 0.06);
      });
    },
    // 06: Passeios na Floresta -> Chilreio de pássaro na floresta
    (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.23);
    },
    // 07: Atividades Sensoriais -> Gota de água / Water droplet bubble
    (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.21);
    },
    // 08: Workshops Pais & Filhos -> Harmonia calorosa em duo
    (ctx) => {
      [659.25, 987.77].forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.42);
      });
    },
    // 09: Estimulação Psicomotora -> Mola elástica "Boing!"
    (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.29);
    },
    // 10: Relação com Animais -> Dois mini-pops lúdicos
    (ctx) => {
      [700, 950].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12 + i * 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + 0.13 + i * 0.08);
      });
    },
    // 11: Identificação de Plantas -> Marimba de madeira orgânica
    (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.31);
    },
    // 12: Ética Ambiental -> Sino harmónico da terra
    (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392, ctx.currentTime);
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.56);
    },
    // 13: Passeios de Bicicleta -> Campainha "Trin-trin"
    (ctx) => {
      [1400, 1400].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.09);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12 + i * 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.09);
        osc.stop(ctx.currentTime + 0.13 + i * 0.09);
      });
    },
    // 14: Ateliers de Férias -> Fanfarra solar festiva
    (ctx) => {
      [587.33, 783.99, 1046.50].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.07);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28 + i * 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.07);
        osc.stop(ctx.currentTime + 0.3 + i * 0.07);
      });
    },
    // 15: Festas de Aniversário -> Celebração mágica vibrante
    (ctx) => {
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.04);
        gain.gain.setValueAtTime(0.14, ctx.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35 + i * 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.04);
        osc.stop(ctx.currentTime + 0.36 + i * 0.04);
      });
    }
  ];

  function playActivitySound(index) {
    try {
      const ctx = getActivityAudioContext();
      if (!ctx) return;
      const soundFn = activitySoundEffects[index % activitySoundEffects.length];
      if (soundFn) soundFn(ctx);
    } catch (e) {
      // Audio playback silently ignored if browser permissions restrict it
    }
  }

  function spawnActivitySparkle(element) {
    const rect = element.getBoundingClientRect();
    const emojis = ['🌱', '🌸', '🍃', '🌼', '🍀'];

    // Spawn 3 cute mini particles with slight delay and spread
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const particle = document.createElement('span');
        particle.innerText = emoji;
        particle.style.position = 'fixed';
        particle.style.left = `${rect.left + rect.width / 2 - 12 + (Math.random() - 0.5) * 36}px`;
        particle.style.top = `${rect.top + 8}px`;
        particle.style.pointerEvents = 'none';
        particle.style.fontSize = `${18 + Math.floor(Math.random() * 8)}px`;
        particle.style.zIndex = '9999';
        particle.style.transition = 'transform 1.2s ease-out, opacity 1.2s ease-out';
        document.body.appendChild(particle);

        requestAnimationFrame(() => {
          const offsetX = (Math.random() - 0.5) * 70;
          const offsetY = -45 - Math.random() * 35;
          const rot = (Math.random() - 0.5) * 60;
          particle.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rot}deg)`;
          particle.style.opacity = '0';
        });

        setTimeout(() => particle.remove(), 1250);
      }, i * 60);
    }
  }

  activityItems.forEach((item, index) => {
    const iconBox = item.querySelector('.activity-icon-container') || item.querySelector('.w-12');
    let danceTimeline = null;

    // Ao passar o rato, o ícone baloiça devagar, como uma folha ao vento
    item.addEventListener('mouseenter', () => {
      if (!iconBox || !window.gsap || reduceMotion) return;
      if (danceTimeline) danceTimeline.kill();

      danceTimeline = gsap.timeline({ repeat: -1, yoyo: true })
        .fromTo(iconBox, { y: 0, rotation: -5 }, { y: -4, rotation: 5, duration: 0.9, ease: 'sine.inOut' });
    });

    item.addEventListener('mouseleave', () => {
      if (!iconBox || !window.gsap) return;
      if (danceTimeline) {
        danceTimeline.kill();
        danceTimeline = null;
      }
      gsap.to(iconBox, { y: 0, rotation: 0, scale: 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
    });

    item.addEventListener('click', () => {
      playActivitySound(index);
      spawnActivitySparkle(item);

      if (window.gsap && !reduceMotion) {
        // Pequeno "respirar" do cartão: sobe um pouco e assenta com suavidade
        gsap.timeline()
          .to(item, { y: -6, scale: 1.02, boxShadow: '0 18px 30px -12px rgba(74,107,83,0.3)', duration: 0.25, ease: 'power2.out' })
          .to(item, { y: 0, scale: 1, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', duration: 0.6, ease: 'sine.out' });
      }
    });
  });

  // --- FAIXA DE FOTOS (7.Faixa_fotos) DYNAMIC LOADER ---
  const faixaPhotos = [
    { file: '1.jpg', alt: 'Criança a observar com uma lupa' },
    { file: '2.jpg', alt: 'Relvado com tenda e trampolim' },
    { file: '3.jpg', alt: 'Galinhas no jardim' },
    { file: '4.jpg', alt: 'Trampolim com rede de proteção' },
    { file: '5.png', alt: 'Crianças e adultos no jardim' },
    { file: '6.png', alt: 'Crianças a fazer um jogo no chão do salão' },
    { file: '7.jpg', alt: 'Criança a dar folhas a uma cabra' },
    { file: '8.png', alt: 'Crianças a caminhar no jardim' },
  ];

  // Friso de fotos em "Princípios e valores"
  function initFaixaMarquee() {
    const card = ({ file, alt }, hidden) => `
      <div class="w-64 sm:w-80 lg:w-[380px] h-48 sm:h-60 lg:h-64 rounded-3xl overflow-hidden shadow-sm shrink-0 relative"${hidden ? ' aria-hidden="true"' : ''}>
        <img src="assets/images/7.Faixa_fotos/${file}" alt="${hidden ? '' : alt}" loading="lazy" decoding="async"
          class="w-full h-full object-cover">
      </div>
    `;

    // Duplicado para o loop infinito (a cópia fica escondida dos leitores de ecrã)
    const html = faixaPhotos.map((p) => card(p, false)).join('') + faixaPhotos.map((p) => card(p, true)).join('');
    document.querySelectorAll('.photo-marquee-track').forEach((track) => {
      track.innerHTML = html;
    });
  }

  initFaixaMarquee();

  // --- LIGHTBOX (Espaço e Dia Aberto) com anterior/seguinte, teclado e deslizar ---
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxBadge = document.getElementById('lightbox-badge');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  const galleryBadges = {
    espaco: 'Espaço Terra da Fonte',
    'dia-aberto': 'Dia Aberto, 5 de setembro',
  };

  // Os cartões do Espaço são <div>: tornam-se acessíveis por teclado
  document.querySelectorAll('.space-card').forEach((card) => {
    card.dataset.gallery = card.dataset.gallery || 'espaco';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Ver fotografia: ${card.dataset.title}`);
  });

  const galleryItems = Array.from(document.querySelectorAll('.space-card, .album-card'));
  let currentGallery = [];
  let currentIndex = 0;
  let lastFocused = null;

  function renderLightbox() {
    const item = currentGallery[currentIndex];
    if (!item) return;
    lightboxImg.src = item.dataset.img;
    lightboxImg.alt = item.querySelector('img')?.alt || item.dataset.title || '';
    if (lightboxTitle) lightboxTitle.textContent = item.dataset.title || '';
    if (lightboxDesc) lightboxDesc.textContent = item.dataset.desc || '';
    if (lightboxBadge) lightboxBadge.textContent = galleryBadges[item.dataset.gallery] || '';
    const many = currentGallery.length > 1;
    if (lightboxCounter) lightboxCounter.textContent = many ? `${currentIndex + 1} de ${currentGallery.length}` : '';
    lightboxPrev?.classList.toggle('hidden', !many);
    lightboxNext?.classList.toggle('hidden', !many);
  }

  function openLightbox(item) {
    if (!lightboxModal || !lightboxImg) return;
    currentGallery = galleryItems.filter((el) => el.dataset.gallery === item.dataset.gallery);
    currentIndex = currentGallery.indexOf(item);
    lastFocused = document.activeElement;
    renderLightbox();
    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    lightboxClose?.focus();
  }

  function closeLightbox() {
    if (!lightboxModal || lightboxModal.classList.contains('hidden')) return;
    lightboxModal.classList.add('hidden');
    lightboxModal.classList.remove('flex');
    document.body.style.overflow = '';
    lastFocused?.focus();
  }

  function stepLightbox(delta) {
    if (currentGallery.length < 2) return;
    currentIndex = (currentIndex + delta + currentGallery.length) % currentGallery.length;
    renderLightbox();
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
    if (item.classList.contains('space-card')) {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    }
  });

  if (lightboxModal && lightboxImg) {
    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', () => stepLightbox(-1));
    lightboxNext?.addEventListener('click', () => stepLightbox(1));
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lightboxModal.classList.contains('hidden')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    });

    // Deslizar no telemóvel
    let touchStartX = null;
    lightboxImg.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightboxImg.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) stepLightbox(dx < 0 ? 1 : -1);
      touchStartX = null;
    });
  }

  // --- SCROLLSPY (DESTAQUE DA SECÇÃO ATIVA) ---
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function updateActiveNav() {
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    [...navLinks, ...mobileNavLinks].forEach((link) => {
      const isCurrent = link.getAttribute('href')?.replace('#', '') === currentId;
      link.classList.toggle('is-active', isCurrent);
      if (isCurrent) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // --- BARRA DE PROGRESSO + VOLTAR AO TOPO ---
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  let scrollTicking = false;

  function updateScrollUI() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    if (scrollProgress) scrollProgress.style.transform = `scaleX(${progress})`;
    if (backToTop) backToTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 1.2);
    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(updateScrollUI);
    }
  }, { passive: true });
  updateScrollUI();

  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      document.getElementById('conteudo')?.focus({ preventScroll: true });
    });
  }

  // --- ILUSTRAÇÃO DO TOPO: inclina ligeiramente com o rato (só desktop) ---
  const heroIllustration = document.getElementById('hero-logo-trigger');
  const heroCard = heroIllustration?.querySelector('.hero-illustration-card');
  if (heroIllustration && heroCard && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    heroIllustration.addEventListener('pointermove', (e) => {
      const rect = heroIllustration.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroCard.style.transform = `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) scale(1.02)`;
    });
    heroIllustration.addEventListener('pointerleave', () => {
      heroCard.style.transform = '';
    });
  }

  // Links com âncora (ex.: .../#dia-aberto): o Tailwind via CDN e as imagens mudam a altura
  // da página depois do salto inicial do browser, por isso repetimos o salto no fim do carregamento.
  window.addEventListener('load', () => {
    if (location.hash.length < 2) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
  });

  // --- MOTOR DE MÚSICA & SONS DA NATUREZA (Web Audio API) ---
  let audioCtx = null;
  let isAudioPlaying = false;
  let masterGain = null;
  let soundIntervals = [];

  const ambientWidget = document.getElementById('ambient-sound-widget');
  const ambientButtons = document.querySelectorAll('.ambient-sound-toggle');
  const ambientIcons = document.querySelectorAll('#ambient-sound-icon');
  const ambientStatuses = document.querySelectorAll('#ambient-sound-status');

  function syncAmbientControls() {
    ambientButtons.forEach((button) => {
      button.classList.toggle('audio-playing', isAudioPlaying);
      button.classList.toggle('audio-paused', !isAudioPlaying);
    });

    ambientIcons.forEach((icon) => {
      icon.setAttribute('data-lucide', isAudioPlaying ? 'volume-2' : 'music');
    });

    ambientStatuses.forEach((status) => {
      status.textContent = isAudioPlaying ? 'A reproduzir sons suaves' : 'Toque para ouvir';
    });

    if (window.lucide) lucide.createIcons();
  }

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
  }

  // Notas suaves pentatónicas tipo Kalimba / Glockenspiel acústico
  function playKalimbaNote(freq, time, duration = 2.4, volume = 0.08) {
    if (!audioCtx || !isAudioPlaying) return;
    try {
      const osc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, time);

      noteGain.gain.setValueAtTime(0.001, time);
      noteGain.gain.exponentialRampToValueAtTime(volume, time + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(time);
      osc.stop(time + duration + 0.1);
    } catch (e) { }
  }

  // Canto suave de pássaros da floresta
  function playBirdChirp() {
    if (!audioCtx || !isAudioPlaying) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const baseFreq = 2200 + Math.random() * 600;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 500, now + 0.07);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, now + 0.14);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.025, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) { }
  }

  // Escala pentatónica suave da natureza (C, D, E, G, A, C5, D5, E5)
  const pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

  function triggerAmbientSequence() {
    if (!audioCtx || !isAudioPlaying) return;
    const now = audioCtx.currentTime;

    const note1 = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];
    const note2 = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];

    playKalimbaNote(note1, now, 2.8, 0.07);
    playKalimbaNote(note2, now + 0.35 + Math.random() * 0.3, 2.2, 0.05);

    if (Math.random() > 0.4) {
      setTimeout(playBirdChirp, 700 + Math.random() * 1000);
    }
  }

  function startAmbientMusic() {
    initAudioContext();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    isAudioPlaying = true;

    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.65, audioCtx.currentTime + 1.0);

    triggerAmbientSequence();

    const loopInterval = setInterval(() => {
      if (isAudioPlaying) triggerAmbientSequence();
    }, 2800);
    soundIntervals.push(loopInterval);

    const birdInterval = setInterval(() => {
      if (isAudioPlaying && Math.random() > 0.3) playBirdChirp();
    }, 4200);
    soundIntervals.push(birdInterval);

    syncAmbientControls();
  }

  function pauseAmbientMusic() {
    if (!audioCtx) return;
    isAudioPlaying = false;

    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);

    soundIntervals.forEach(clearInterval);
    soundIntervals = [];

    syncAmbientControls();
  }

  if (ambientButtons.length > 0) {
    ambientButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (!isAudioPlaying) {
          startAmbientMusic();
        } else {
          pauseAmbientMusic();
        }
      });
    });
    syncAmbientControls();
  }

  // --- FILTRO DE ATIVIDADES ---
  const actFilterBtns = document.querySelectorAll('.activity-filter-btn');
  const actItems = document.querySelectorAll('.activity-item');

  if (actFilterBtns.length > 0 && actItems.length > 0) {
    actFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        actFilterBtns.forEach((b) => {
          b.classList.remove('active', 'bg-[#4A6B53]', 'text-white', 'border-[#4A6B53]', 'shadow-sm');
          b.classList.add('bg-[#FAF7F2]', 'text-[#3D342F]', 'border-[#E8F0E6]', 'shadow-xs');
        });

        btn.classList.add('active', 'bg-[#4A6B53]', 'text-white', 'border-[#4A6B53]', 'shadow-sm');
        btn.classList.remove('bg-[#FAF7F2]', 'text-[#3D342F]', 'border-[#E8F0E6]', 'shadow-xs');

        const filter = btn.getAttribute('data-filter');
        const visibleItems = [];

        actItems.forEach((item) => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'flex';
            visibleItems.push(item);
          } else {
            item.style.display = 'none';
          }
        });

        // Always animate all visible items on every click
        if (typeof gsap !== 'undefined' && visibleItems.length > 0) {
          gsap.killTweensOf(visibleItems);
          gsap.fromTo(
            visibleItems,
            { opacity: 0, scale: 0.92, y: 14 },
            { opacity: 1, scale: 1, y: 0, duration: 0.3, stagger: 0.035, ease: 'power2.out', overwrite: 'auto' }
          );
        }
      });
    });
  }
});

// Helper for quick copy of phone / email / map
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    alert(`${label} (${text}) copiado para a área de transferência!`);
  }).catch(() => {
    alert(`Contacto: ${text}`);
  });
}
