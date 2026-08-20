/**
 * KidsClub.daFonte - Main Application Logic
 * Integrates GSAP animations, interactive schedule with paired media,
 * activity filters, space lightbox, pedagogy tabs, and dynamic enrollment submission.
 */

document.addEventListener('DOMContentLoaded', () => {
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

  // GSAP Animations setup
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.gsap-reveal').forEach((elem) => {
      gsap.fromTo(
        elem,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    gsap.utils.toArray('.gsap-stagger-container').forEach((container) => {
      const cards = container.querySelectorAll('.gsap-stagger-item');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
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

  // --- INTERACTIVE ECOPEDAGOGY SENSES EXPLORER ---
  const senseTabBtns = document.querySelectorAll('.sense-tab-btn');
  const senseImg = document.getElementById('sense-img');
  const senseImgCaption = document.getElementById('sense-img-caption');
  const senseBadgeText = document.getElementById('sense-badge-text');
  const senseBadgeContainer = document.getElementById('sense-badge-container');
  const senseTitle = document.getElementById('sense-title');
  const senseSubtitle = document.getElementById('sense-subtitle');
  const senseTagsContainer = document.getElementById('sense-tags-container');

  const sensesData = {
    experimentar: {
      title: 'Experimentar',
      badge: 'Tato & Matéria Viva',
      subtitle: 'Aprender e descobrir através do toque e da manipulação direta de terra, argila, sementes e água.',
      image: 'assets/images/Kids/contacto com a natureza.jpg',
      imageCaption: 'Contacto tátil com a terra, água e elementos naturais',
      accentColor: '#4A6B53',
      bgLight: '#E8F0E6',
      iconBgInactive: '#E8F0E6',
      iconColorInactive: '#4A6B53',
      tags: ['Tato e Exploração', 'Manipulação Direta', 'Terra, Argila e Sementes']
    },
    sentir: {
      title: 'Sentir',
      badge: 'Coração & Segurança Afetiva',
      subtitle: 'Acolhimento afetivo diário, escuta ativa das emoções, desenvolvimento da empatia e vínculos seguros.',
      image: 'assets/images/Kids/crianças.jpeg',
      imageCaption: 'Círculo de boas-vindas e acolhimento afetuoso',
      accentColor: '#D97757',
      bgLight: '#FAF0EB',
      iconBgInactive: '#FAF0EB',
      iconColorInactive: '#D97757',
      tags: ['Escuta Afetiva', 'Empatia Interpessoal', 'Vínculo e Segurança']
    },
    interpretar: {
      title: 'Interpretar',
      badge: 'Mente & Curiosidade',
      subtitle: 'Estímulo à curiosidade natural, levantamento de hipóteses e compreensão dos ciclos e fenómenos vivos.',
      image: 'assets/images/Kids/Exploração ou curiosidade.jpg',
      imageCaption: 'Descoberta orientada e estímulo à curiosidade nata',
      accentColor: '#C58B1A',
      bgLight: '#FEF9E7',
      iconBgInactive: '#FEF9E7',
      iconColorInactive: '#C58B1A',
      tags: ['Curiosidade Nata', 'Pensamento Crítico', 'Investigação da Natureza']
    },
    socializar: {
      title: 'Socializar',
      badge: 'Comunidade & Pares',
      subtitle: 'Brincadeira livre partilhada, tarefas cooperativas na quinta e construção de relações harmoniosas.',
      image: 'assets/images/Open_Day/jogo do galo.jpg',
      imageCaption: 'Jogos cooperativos e entreajuda na quinta',
      accentColor: '#3D7858',
      bgLight: '#E8F0E6',
      iconBgInactive: '#E8F0E6',
      iconColorInactive: '#3D7858',
      tags: ['Brincadeira Partilhada', 'Tarefas Comunitárias', 'Respeito e Cooperação']
    },
    contemplar: {
      title: 'Contemplar',
      badge: 'Presença & Serenidade',
      subtitle: 'Momentos de calma e respiração ao ar livre, escuta atenta dos pássaros e admiração da natureza.',
      image: 'assets/images/Space/espaço.jpg',
      imageCaption: 'Pausa serena, respiração ao ar livre e admiração silenciosa',
      accentColor: '#C86D51',
      bgLight: '#FAF0EB',
      iconBgInactive: '#FAF0EB',
      iconColorInactive: '#C86D51',
      tags: ['Presença Serena', 'Escuta dos Pássaros', 'Momentos Sem Pressa']
    },
    integrar: {
      title: 'Integrar',
      badge: 'Arte, Expressão & Criação',
      subtitle: 'Síntese das vivências através da expressão plástica, música, ritmo corporal, teatro e contos.',
      image: 'assets/images/Kids/aprendi sensorial.jpg',
      imageCaption: 'Expressão plástica, música, teatro e contos',
      accentColor: '#935D43',
      bgLight: '#F5EDE8',
      iconBgInactive: '#F5EDE8',
      iconColorInactive: '#935D43',
      tags: ['Expressão Plástica', 'Música & Ritmo', 'Narrativas e Dança']
    }
  };

  function activateSense(senseKey) {
    const data = sensesData[senseKey];
    if (!data) return;

    senseTabBtns.forEach((btn) => {
      const btnSense = btn.getAttribute('data-sense');
      const isCurrent = btnSense === senseKey;
      const iconBox = btn.querySelector('div');
      const btnTitle = btn.querySelector('h4');
      const btnDesc = btn.querySelector('span');
      const senseConfig = sensesData[btnSense] || data;

      if (isCurrent) {
        btn.classList.add('active', 'shadow-md', 'scale-102');
        btn.style.backgroundColor = data.accentColor;
        btn.style.borderColor = data.accentColor;
        btn.style.color = '#FFFFFF';
        if (iconBox) {
          iconBox.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          iconBox.style.color = '#FFFFFF';
        }
        if (btnTitle) btnTitle.style.color = '#FFFFFF';
        if (btnDesc) {
          btnDesc.style.color = 'rgba(255, 255, 255, 0.9)';
          btnDesc.classList.remove('text-gray-500');
        }
      } else {
        btn.classList.remove('active', 'shadow-md', 'scale-102');
        btn.style.backgroundColor = '#FFFFFF';
        btn.style.borderColor = '#E8F0E6';
        btn.style.color = '#3D342F';
        if (iconBox) {
          iconBox.style.backgroundColor = senseConfig.iconBgInactive;
          iconBox.style.color = senseConfig.iconColorInactive;
        }
        if (btnTitle) btnTitle.style.color = '#3D342F';
        if (btnDesc) {
          btnDesc.style.color = '#6B7280';
          btnDesc.classList.add('text-gray-500');
        }
      }
    });

    if (senseImg) {
      senseImg.style.transition = 'opacity 0.2s ease';
      senseImg.style.opacity = '0';
      setTimeout(() => {
        senseImg.src = data.image;
        senseImg.alt = `Sentido: ${data.title}`;
        if (senseImgCaption) senseImgCaption.textContent = data.imageCaption;
        senseImg.style.opacity = '1';
      }, 150);
    }

    if (senseTitle) {
      senseTitle.textContent = data.title;
      senseTitle.style.color = data.accentColor;
    }
    if (senseSubtitle) {
      senseSubtitle.textContent = data.subtitle;
    }
    if (senseBadgeText) {
      senseBadgeText.textContent = data.badge;
    }
    if (senseBadgeContainer) {
      senseBadgeContainer.style.backgroundColor = data.bgLight;
      senseBadgeContainer.style.color = data.accentColor;
      senseBadgeContainer.style.borderColor = data.accentColor + '40';
    }

    if (senseTagsContainer) {
      senseTagsContainer.innerHTML = data.tags
        .map(
          (tag) =>
            `<span class="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#E8F0E6] shadow-xs" style="color: ${data.accentColor}">
              <i data-lucide="check-circle" class="w-3.5 h-3.5" style="color: ${data.accentColor}"></i> ${tag}
            </span>`
        )
        .join('');
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  senseTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const senseKey = btn.getAttribute('data-sense');
      activateSense(senseKey);
    });
  });

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
  const footerElement = document.querySelector('footer');

  function syncAmbientSurfaceState(isOverFooter) {
    if (!ambientWidget) return;
    ambientWidget.classList.toggle('ambient-sound-widget--footer', isOverFooter);
  }

  function updateAmbientSurfaceState() {
    if (!footerElement) return;
    const footerRect = footerElement.getBoundingClientRect();
    const isFooterVisible = footerRect.top < window.innerHeight - 120 && footerRect.bottom > 0;
    syncAmbientSurfaceState(isFooterVisible);
  }

  if (ambientWidget && footerElement) {
    window.addEventListener('scroll', updateAmbientSurfaceState, { passive: true });
    window.addEventListener('resize', updateAmbientSurfaceState, { passive: true });
    updateAmbientSurfaceState();
  }

  function syncAmbientControls() {
    ambientButtons.forEach((button) => {
      button.classList.toggle('audio-playing', isAudioPlaying);
      button.classList.toggle('audio-paused', !isAudioPlaying);
      button.classList.toggle('shadow-xl', isAudioPlaying);
      button.classList.toggle('border-[#4A6B53]/35', isAudioPlaying);
      button.classList.toggle('bg-[#E8F0E6]', isAudioPlaying);
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
