/**
 * KidsClub.daFonte - Main Application Logic
 * Integrates GSAP animations, interactive schedule with paired media,
 * activity filters, space lightbox, pedagogy tabs, and dynamic enrollment submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 3. 💻 Assinatura Completa na Consola (F12)
  const crabAsciiArt = `
   __       __
  / <\`     \'> \\
 (  / @   @ \\  )
  \\(_ _\\_/_ _)/
(\\ \`-/     \\-\' /)
 "===\\     /==="
  .==\')___(\`==.
 ' .=\'     \`=.

 🦀 Vullkano was here 🦀
  `;
  console.log(
    `%c${crabAsciiArt}`,
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
          playTone(ctx, { type: 'triangle', from: freq, start: now + idx * 0.055, duration: 0.45, volume: 0.14 });
        });
      } else if (type === 'fanfare') {
        // Fanfarra do código secreto
        [392, 523.25, 659.25, 783.99, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          playTone(ctx, { type: 'square', from: freq, start: now + idx * 0.1, duration: 0.16, volume: 0.05 });
        });
      }
    } catch (e) {
      // Ignora silenciosamente se o áudio não for permitido pelo browser
    }
  }

  // 1. 🦀 O Caranguejo Vullkano atravessa o ecrã
  //    (segredo: 3 cliques no texto de copyright do rodapé)
  const footerTrigger = document.getElementById('footer-copyright-trigger');
  let footerClickCount = 0;
  let footerClickTimer = null;
  let crabIsWalking = false;

  const crabMessages = [
    'Vullkano was here!',
    'Fui eu que fiz este site 🌿',
    'Olá! Sou o caranguejo do Vullkano',
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

  function showVullkanoCrab() {
    if (crabIsWalking) return;
    crabIsWalking = true;
    playEasterEggSound('crab');
    spawnCrab({ message: crabMessages[crabMessageIndex++ % crabMessages.length] });

    if (!reduceMotion) {
      let steps = 0;
      const stepTimer = setInterval(() => {
        playEasterEggSound('step');
        if (++steps > 12) clearInterval(stepTimer);
      }, 170);
    }

    setTimeout(() => { crabIsWalking = false; }, reduceMotion ? 3500 : 7600);
  }

  if (footerTrigger) {
    footerTrigger.addEventListener('click', () => {
      footerClickCount++;
      if (footerClickTimer) clearTimeout(footerClickTimer);
      footerClickTimer = setTimeout(() => {
        footerClickCount = 0;
      }, 1500);

      if (footerClickCount >= 3) {
        footerClickCount = 0;
        showVullkanoCrab();
      }
    });
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

    const icons = ['🍃', '🌿', '🌸', '🌼', '🧡', '✨', '☀️', '🦀', '🍀'];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      const icon = icons[Math.floor(Math.random() * icons.length)];
      p.innerText = icon;
      p.style.position = 'absolute';
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = '-40px';
      p.style.fontSize = `${18 + Math.random() * 22}px`;
      p.style.opacity = '1';
      p.style.userSelect = 'none';
      particlesContainer.appendChild(p);

      const duration = 2.8 + Math.random() * 2.2;
      const delay = Math.random() * 0.8;
      const xEnd = (Math.random() - 0.5) * 220;
      const rotation = (Math.random() - 0.5) * 720;

      if (window.gsap) {
        gsap.to(p, {
          y: window.innerHeight + 80,
          x: `+=${xEnd}`,
          rotation: rotation,
          duration: duration,
          delay: delay,
          ease: 'power1.inOut',
          opacity: 0.9
        });
      } else {
        p.style.transition = `transform ${duration}s ease, opacity ${duration}s ease`;
        p.style.transform = `translateY(${window.innerHeight + 80}px) rotate(${rotation}deg)`;
      }
    }

    setTimeout(() => {
      particlesContainer.remove();
    }, 5500);
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
    const count = window.innerWidth < 640 ? 5 : 9;
    for (let i = 0; i < count; i++) {
      spawnCrab({
        bottom: 12 + Math.random() * Math.min(260, window.innerHeight * 0.35),
        duration: 4 + Math.random() * 2.5,
        delay: i * 0.35,
        size: 28 + Math.random() * 26,
        message: i === Math.floor(count / 2) ? 'Desfile oficial dos caranguejos! 🦀' : null,
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
        { opacity: 0, y: isMobile ? 10 : 20 },
        {
          opacity: 1,
          y: 0,
          duration: isMobile ? 0.28 : 0.45,
          ease: 'power2.out',
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

  // --- PROGRAMA DIÁRIO TABS & ANIMAÇÃO SELETIVA INTELIGENTE ---
  const scheduleTabs = document.querySelectorAll('.schedule-tab');
  const scheduleSlotLeft = document.getElementById('schedule-slot-left');
  const scheduleSlotRight = document.getElementById('schedule-slot-right');
  const scheduleColManha = document.getElementById('schedule-col-manha');
  const scheduleColTarde = document.getElementById('schedule-col-tarde');
  const scheduleMediaManha = document.getElementById('schedule-media-manha');
  const scheduleMediaTarde = document.getElementById('schedule-media-tarde');

  let currentScheduleMode = 'all';

  function syncScheduleHeight() {
    if (!scheduleColTarde) return;
    if (window.innerWidth < 1024) {
      if (scheduleColManha) scheduleColManha.style.minHeight = '';
      if (scheduleMediaManha) scheduleMediaManha.style.minHeight = '';
      if (scheduleMediaTarde) scheduleMediaTarde.style.minHeight = '';
      return;
    }
    // Período da Tarde defines the master natural height
    const naturalHeight = scheduleColTarde.offsetHeight;
    if (naturalHeight > 100) {
      if (scheduleColManha) scheduleColManha.style.minHeight = `${naturalHeight}px`;
      if (scheduleMediaManha) scheduleMediaManha.style.minHeight = `${naturalHeight}px`;
      if (scheduleMediaTarde) scheduleMediaTarde.style.minHeight = `${naturalHeight}px`;
    }
  }

  function updateScheduleDOM(mode) {
    if (mode === 'all') {
      if (scheduleColManha) scheduleColManha.classList.remove('hidden');
      if (scheduleColTarde) scheduleColTarde.classList.remove('hidden');
      if (scheduleMediaManha) scheduleMediaManha.classList.add('hidden');
      if (scheduleMediaTarde) scheduleMediaTarde.classList.add('hidden');
    } else if (mode === 'manha') {
      if (scheduleColManha) scheduleColManha.classList.remove('hidden');
      if (scheduleColTarde) scheduleColTarde.classList.add('hidden');
      if (scheduleMediaManha) scheduleMediaManha.classList.remove('hidden');
      if (scheduleMediaTarde) scheduleMediaTarde.classList.add('hidden');
    } else if (mode === 'tarde') {
      if (scheduleColManha) scheduleColManha.classList.add('hidden');
      if (scheduleColTarde) scheduleColTarde.classList.remove('hidden');
      if (scheduleMediaManha) scheduleMediaManha.classList.add('hidden');
      if (scheduleMediaTarde) scheduleMediaTarde.classList.remove('hidden');
    }

    syncScheduleHeight();
    if (window.lucide) lucide.createIcons();
  }

  function getChangingSlots(prevMode, nextMode) {
    if (prevMode === nextMode) return [];

    // Slot Left displays: 'manha' schedule in 'all' and 'manha'; 'media' in 'tarde'
    const prevLeftType = (prevMode === 'tarde') ? 'media' : 'manha';
    const nextLeftType = (nextMode === 'tarde') ? 'media' : 'manha';
    const leftChanges = prevLeftType !== nextLeftType;

    // Slot Right displays: 'tarde' schedule in 'all' and 'tarde'; 'media' in 'manha'
    const prevRightType = (prevMode === 'manha') ? 'media' : 'tarde';
    const nextRightType = (nextMode === 'manha') ? 'media' : 'tarde';
    const rightChanges = prevRightType !== nextRightType;

    const changing = [];
    if (leftChanges && scheduleSlotLeft) changing.push(scheduleSlotLeft);
    if (rightChanges && scheduleSlotRight) changing.push(scheduleSlotRight);
    return changing;
  }

  scheduleTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;

      const newMode = tab.getAttribute('data-mode');
      const changingSlots = getChangingSlots(currentScheduleMode, newMode);

      scheduleTabs.forEach((t) => {
        t.classList.remove('active', 'bg-[#4A6B53]', 'text-white', 'shadow-xs');
        t.classList.add('bg-transparent', 'text-[#3D342F]');
      });

      tab.classList.add('active', 'bg-[#4A6B53]', 'text-white', 'shadow-xs');
      tab.classList.remove('bg-transparent', 'text-[#3D342F]');

      // Only animate slots whose content actually changes!
      if (window.gsap && changingSlots.length > 0) {
        gsap.to(changingSlots, {
          opacity: 0.15,
          y: 4,
          duration: 0.15,
          ease: 'power1.out',
          onComplete: () => {
            updateScheduleDOM(newMode);
            currentScheduleMode = newMode;
            gsap.fromTo(
              changingSlots,
              { opacity: 0.15, y: 10 },
              { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
            );
          }
        });
      } else {
        updateScheduleDOM(newMode);
        currentScheduleMode = newMode;
      }
    });
  });

  // Initial sync on load and resize
  window.addEventListener('load', syncScheduleHeight);
  window.addEventListener('resize', syncScheduleHeight);
  setTimeout(syncScheduleHeight, 150);

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
    const emojis = ['✨', '🌱', '🌸', '🍃', '⭐', '🎈', '🎨', '🎵', '💛', '🎶'];

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
        particle.style.transition = 'all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        document.body.appendChild(particle);

        requestAnimationFrame(() => {
          const offsetX = (Math.random() - 0.5) * 70;
          const offsetY = -45 - Math.random() * 35;
          const rot = (Math.random() - 0.5) * 60;
          particle.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.4) rotate(${rot}deg)`;
          particle.style.opacity = '0';
        });

        setTimeout(() => particle.remove(), 750);
      }, i * 60);
    }
  }

  activityItems.forEach((item, index) => {
    const iconBox = item.querySelector('.activity-icon-container') || item.querySelector('.w-12');
    let danceTimeline = null;

    // Smooth rhythmic dance on hover
    item.addEventListener('mouseenter', () => {
      if (!iconBox || !window.gsap) return;
      if (danceTimeline) danceTimeline.kill();

      danceTimeline = gsap.timeline({ repeat: -1 })
        .to(iconBox, { y: -7, rotation: -13, duration: 0.28, ease: 'power1.out' })
        .to(iconBox, { y: 0, rotation: -2, duration: 0.26, ease: 'power1.in' })
        .to(iconBox, { y: -7, rotation: 13, duration: 0.28, ease: 'power1.out' })
        .to(iconBox, { y: 0, rotation: 0, duration: 0.26, ease: 'power1.in' });
    });

    // Soft, organic post-hover return to rest position (never abrupt)
    item.addEventListener('mouseleave', () => {
      if (!iconBox || !window.gsap) return;
      if (danceTimeline) {
        danceTimeline.kill();
        danceTimeline = null;
      }
      gsap.to(iconBox, {
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.45,
        ease: 'elastic.out(1.2, 0.4)',
        overwrite: 'auto'
      });
    });

    item.addEventListener('click', () => {
      playActivitySound(index);
      spawnActivitySparkle(item);

      const title = item.querySelector('h4');

      if (window.gsap) {
        // Full cute jelly wiggle dance on the entire card!
        gsap.timeline()
          // 1. Squish down to prepare jump
          .to(item, {
            scaleX: 1.16,
            scaleY: 0.84,
            y: 4,
            duration: 0.08,
            ease: 'power1.in'
          })
          // 2. High jump & happy tilt right
          .to(item, {
            y: -20,
            scaleX: 0.88,
            scaleY: 1.18,
            rotation: 14,
            boxShadow: '0 20px 30px -8px rgba(74,107,83,0.3)',
            duration: 0.16,
            ease: 'power2.out'
          })
          // 3. Wiggle dance left in mid-air
          .to(item, {
            y: -14,
            rotation: -14,
            scaleX: 1.08,
            scaleY: 0.92,
            duration: 0.14,
            ease: 'power1.inOut'
          })
          // 4. Wiggle dance right
          .to(item, {
            y: -6,
            rotation: 10,
            scaleX: 0.95,
            scaleY: 1.05,
            duration: 0.12,
            ease: 'power1.inOut'
          })
          // 5. Wiggle dance left
          .to(item, {
            y: -2,
            rotation: -5,
            scaleX: 1.02,
            scaleY: 0.98,
            duration: 0.1,
            ease: 'power1.inOut'
          })
          // 6. Elastic happy jelly landing!
          .to(item, {
            y: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            duration: 0.45,
            ease: 'elastic.out(1.4, 0.35)'
          });

        // Title bounce wave
        if (title) {
          gsap.timeline()
            .to(title, { y: -4, scale: 1.08, duration: 0.15, ease: 'power2.out' })
            .to(title, { y: 0, scale: 1, duration: 0.35, ease: 'elastic.out(1.2, 0.4)' });
        }
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

  function initFaixaMarquee() {
    const marqueeTrack = document.querySelector('.photo-marquee-track');
    if (!marqueeTrack) return;

    const card = ({ file, alt }, hidden) => `
      <div class="w-64 sm:w-80 lg:w-[380px] h-48 sm:h-60 lg:h-64 rounded-3xl overflow-hidden shadow-sm shrink-0 relative"${hidden ? ' aria-hidden="true"' : ''}>
        <img src="assets/images/7.Faixa_fotos/${file}" alt="${hidden ? '' : alt}" loading="lazy" decoding="async"
          class="w-full h-full object-cover">
      </div>
    `;

    // Duplicado para o loop infinito (a cópia fica escondida dos leitores de ecrã)
    marqueeTrack.innerHTML = faixaPhotos.map((p) => card(p, false)).join('') + faixaPhotos.map((p) => card(p, true)).join('');
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

  // Enrollment Modal & Dynamic Pricing Calculator
  const enrollmentModal = document.getElementById('enrollment-modal');
  const openEnrollmentBtns = document.querySelectorAll('.open-enrollment-btn');
  const closeEnrollmentBtn = document.getElementById('close-enrollment-btn');
  const enrollmentForm = document.getElementById('enrollment-form');
  const calculatedPriceElem = document.getElementById('calculated-price');
  const modalPlanSelect = document.getElementById('modal-plan');
  const modalKidsInput = document.getElementById('modal-kids');

  function getValidKidsCount() {
    if (!modalKidsInput) return 1;
    let val = parseInt(modalKidsInput.value, 10);
    if (isNaN(val) || val < 1) {
      return 1;
    }
    return val;
  }

  function calculatePrice() {
    if (!modalPlanSelect || !calculatedPriceElem) return;
    const plan = modalPlanSelect.value;
    const kids = getValidKidsCount();
    const basePrice = (plan === 'meio-dia') ? 200 : 350;
    const total = basePrice * kids;

    calculatedPriceElem.textContent = `${total}€ / mês`;
  }

  if (modalPlanSelect && modalKidsInput) {
    modalPlanSelect.addEventListener('change', calculatePrice);
    modalKidsInput.addEventListener('input', calculatePrice);
    modalKidsInput.addEventListener('change', () => {
      const valid = getValidKidsCount();
      modalKidsInput.value = valid;
      calculatePrice();
    });
  }

  openEnrollmentBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planAttr = btn.getAttribute('data-plan');
      if (planAttr && modalPlanSelect) {
        modalPlanSelect.value = planAttr;
      }
      calculatePrice();
      if (enrollmentModal) {
        // Reset form view if previously submitted
        const successBox = document.getElementById('form-success-message');
        if (successBox) successBox.classList.add('hidden');
        if (enrollmentForm) enrollmentForm.classList.remove('hidden');

        enrollmentModal.classList.remove('hidden');
        enrollmentModal.classList.add('flex');
      }
    });
  });

  if (closeEnrollmentBtn && enrollmentModal) {
    closeEnrollmentBtn.addEventListener('click', () => {
      enrollmentModal.classList.add('hidden');
      enrollmentModal.classList.remove('flex');
    });

    enrollmentModal.addEventListener('click', (e) => {
      if (e.target === enrollmentModal) {
        enrollmentModal.classList.add('hidden');
        enrollmentModal.classList.remove('flex');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !enrollmentModal.classList.contains('hidden')) {
        enrollmentModal.classList.add('hidden');
        enrollmentModal.classList.remove('flex');
      }
    });
  }

  // Direct Submission handler via E-mail (Gmail Web & Mailto)
  if (enrollmentForm) {
    enrollmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const guardianName = document.getElementById('input-guardian-name')?.value || '';
      const guardianPhone = document.getElementById('input-guardian-phone')?.value || '';
      const guardianEmail = document.getElementById('input-guardian-email')?.value || '';
      const childInfo = document.getElementById('input-child-info')?.value || '';
      const planSelect = document.getElementById('modal-plan');
      const planText = planSelect ? planSelect.options[planSelect.selectedIndex].text : '';
      const validKids = getValidKidsCount();
      const kidsText = validKids === 1 ? '1 criança' : `${validKids} crianças`;
      const estimatedPrice = document.getElementById('calculated-price')?.textContent || '';
      const notes = document.getElementById('input-notes')?.value || '';

      const summaryText =
        `Pré-Inscrição KidsClub.daFonte\n\n` +
        `Encarregado de Educação: ${guardianName}\n` +
        `Telemóvel: ${guardianPhone}\n` +
        `E-mail: ${guardianEmail}\n` +
        `Criança (Nome e Idade): ${childInfo}\n` +
        `Modalidade: ${planText}\n` +
        `N.º de Crianças: ${kidsText}\n` +
        `Estimativa Mensal: ${estimatedPrice}\n` +
        (notes ? `Observações: ${notes}\n` : '') +
        `\n--\nEnviado através do site KidsClub.daFonte`;

      const emailSubject = encodeURIComponent(`Pré-Inscrição KidsClub.daFonte - ${childInfo}`);
      const emailBody = encodeURIComponent(summaryText);
      const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=kidsclub.dafonte@gmail.com&su=${emailSubject}&body=${emailBody}`;
      const mailtoUrl = `mailto:kidsclub.dafonte@gmail.com?subject=${emailSubject}&body=${emailBody}`;

      // Open Gmail Web in new tab automatically
      const newWin = window.open(gmailWebUrl, '_blank');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        // If popup blocked, fallback to mailto
        window.location.href = mailtoUrl;
      }

      const successBox = document.getElementById('form-success-message');
      const summaryDisplay = document.getElementById('summary-display');
      const gmailWebBtn = document.getElementById('btn-gmail-web-submit');
      const emailBtn = document.getElementById('btn-email-submit');

      if (summaryDisplay) {
        summaryDisplay.textContent = `${guardianName} • ${childInfo} • ${planText}`;
      }

      if (gmailWebBtn) {
        gmailWebBtn.href = gmailWebUrl;
      }

      if (emailBtn) {
        emailBtn.href = mailtoUrl;
      }

      // Store summary for copying
      window._currentEmailSummary = summaryText;

      enrollmentForm.classList.add('hidden');
      if (successBox) successBox.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
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

// Helper to copy current email text
function copyEmailSummary() {
  const text = window._currentEmailSummary || '';
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Texto da inscrição copiado com sucesso para a área de transferência!');
    }).catch(() => {
      alert('Selecione e copie os dados manualmente.');
    });
  }
}

// Helper for quick copy of phone / email / map
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    alert(`${label} (${text}) copiado para a área de transferência!`);
  }).catch(() => {
    alert(`Contacto: ${text}`);
  });
}
