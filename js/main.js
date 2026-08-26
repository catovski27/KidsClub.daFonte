/**
 * KidsClub.daFonte - Main Application Logic
 * Integrates GSAP animations, interactive schedule with paired media,
 * activity filters, space lightbox, pedagogy tabs, and dynamic enrollment submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Prevenção Rigorosa de Zoom-in / Zoom-out involuntário no Telemóvel (Experiência App Nativa)
  document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });

  // Previne zoom por múltiplos toques simultâneos no telemóvel
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  // Prevenção de Zoom no Computador (Ctrl + Roda do Rato e Atalhos Ctrl + / Ctrl -)
  window.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
    }
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (
      e.key === '+' ||
      e.key === '-' ||
      e.key === '=' ||
      e.key === '_' ||
      e.code === 'NumpadAdd' ||
      e.code === 'NumpadSubtract' ||
      e.code === 'Minus' ||
      e.code === 'Equal'
    )) {
      e.preventDefault();
    }
  });

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
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // GSAP Animations setup (Otimizado: Instantâneo e Fluido no Telemóvel)
  if (typeof gsap !== 'undefined') {
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
    '1.jpg',
    '2.jpg',
    '3.jpg',
    '4.jpg',
    '5.png',
    '6.png',
    '7.jpg',
    '8.png'
  ];

  function initFaixaMarquee() {
    const marqueeTrack = document.querySelector('.photo-marquee-track');
    if (!marqueeTrack) return;

    const cardsHTML = faixaPhotos.map((file, idx) => `
      <div class="w-72 sm:w-80 lg:w-[380px] h-52 sm:h-60 lg:h-64 rounded-3xl overflow-hidden shadow-sm shrink-0 relative group">
        <img src="assets/images/7.Faixa_fotos/${file}" alt="Faixa Foto ${idx + 1}"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
      </div>
    `).join('');

    // Duplicate for infinite marquee loop
    marqueeTrack.innerHTML = cardsHTML + cardsHTML;
  }

  initFaixaMarquee();

  // Lightbox Modal for Space Images & Videos
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.space-card').forEach((card) => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img');
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');

      if (lightboxModal && lightboxImg) {
        lightboxImg.src = imgSrc;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc) lightboxDesc.textContent = desc;
        lightboxModal.classList.remove('hidden');
        lightboxModal.classList.add('flex');
      }
    });
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.add('hidden');
      lightboxModal.classList.remove('flex');
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.add('hidden');
        lightboxModal.classList.remove('flex');
      }
    });
  }

  // Enrollment Modal & Dynamic Pricing Calculator
  const enrollmentModal = document.getElementById('enrollment-modal');
  const openEnrollmentBtns = document.querySelectorAll('.open-enrollment-btn');
  const closeEnrollmentBtn = document.getElementById('close-enrollment-btn');
  const enrollmentForm = document.getElementById('enrollment-form');
  const calculatedPriceElem = document.getElementById('calculated-price');
  const modalPlanSelect = document.getElementById('modal-plan');
  const modalKidsSelect = document.getElementById('modal-kids');

  function calculatePrice() {
    if (!modalPlanSelect || !calculatedPriceElem) return;
    const plan = modalPlanSelect.value;
    const kids = parseInt(modalKidsSelect ? modalKidsSelect.value : '1', 10);
    const basePrice = (plan === 'meio-dia') ? 200 : 350;

    let total = basePrice * kids;
    if (kids > 1) {
      total = Math.round(total * 0.9);
    }

    calculatedPriceElem.textContent = `${total}€ / mês ${kids > 1 ? '(com 10% de desconto de irmão)' : ''}`;
  }

  if (modalPlanSelect && modalKidsSelect) {
    modalPlanSelect.addEventListener('change', calculatePrice);
    modalKidsSelect.addEventListener('change', calculatePrice);
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
  }

  // Direct Submission handler via WhatsApp & Email
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
      const kidsCount = document.getElementById('modal-kids')?.value || '1';
      const estimatedPrice = document.getElementById('calculated-price')?.textContent || '';
      const notes = document.getElementById('input-notes')?.value || '';

      const summaryText =
        `Pré-Inscrição KidsClub.daFonte\n\n` +
        `Encarregado de Educação: ${guardianName}\n` +
        `Telemóvel: ${guardianPhone}\n` +
        `E-mail: ${guardianEmail}\n` +
        `Criança (Nome e Idade): ${childInfo}\n` +
        `Modalidade: ${planText}\n` +
        `N.º de Crianças: ${kidsCount}\n` +
        `Estimativa Mensal: ${estimatedPrice}\n` +
        (notes ? `Observações: ${notes}\n` : '') +
        `\n--\nEnviado através do site KidsClub.daFonte`;

      const emailSubject = encodeURIComponent(`Pré-Inscrição KidsClub.daFonte - ${childInfo}`);
      const emailBody = encodeURIComponent(summaryText);
      const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=info.terradafonte@gmail.com&su=${emailSubject}&body=${emailBody}`;
      const mailtoUrl = `mailto:info.terradafonte@gmail.com?subject=${emailSubject}&body=${emailBody}`;

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

    navLinks.forEach((link) => {
      const href = link.getAttribute('href')?.replace('#', '');
      if (href === currentId) {
        link.classList.add('bg-[#4A6B53]', 'text-white', 'shadow-xs');
        link.classList.remove('text-[#3D342F]', 'hover:text-[#4A6B53]', 'hover:bg-[#E8F0E6]/60');
      } else {
        link.classList.remove('bg-[#4A6B53]', 'text-white', 'shadow-xs');
        link.classList.add('text-[#3D342F]', 'hover:text-[#4A6B53]', 'hover:bg-[#E8F0E6]/60');
      }
    });

    mobileNavLinks.forEach((link) => {
      const href = link.getAttribute('href')?.replace('#', '');
      if (href === currentId) {
        link.classList.add('bg-[#4A6B53]', 'text-white', 'font-bold');
        link.classList.remove('text-[#3D342F]', 'hover:bg-[#E8F0E6]');
      } else {
        link.classList.remove('bg-[#4A6B53]', 'text-white', 'font-bold');
        link.classList.add('text-[#3D342F]', 'hover:bg-[#E8F0E6]');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

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
