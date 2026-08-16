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

  // Schedule Switcher (Manhãs / Tardes / Ver Dia Completo)
  const scheduleTabs = document.querySelectorAll('.schedule-tab');
  const scheduleColManha = document.getElementById('schedule-col-manha');
  const scheduleColTarde = document.getElementById('schedule-col-tarde');
  const scheduleMediaManha = document.getElementById('schedule-media-manha');
  const scheduleMediaTarde = document.getElementById('schedule-media-tarde');

  scheduleTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      scheduleTabs.forEach((t) => {
        t.classList.remove('active', 'bg-[#4A6B53]', 'text-white');
        t.classList.add('bg-white', 'text-[#3D342F]');
      });

      tab.classList.add('active', 'bg-[#4A6B53]', 'text-white');
      tab.classList.remove('bg-white', 'text-[#3D342F]');

      const mode = tab.getAttribute('data-mode');

      if (mode === 'all') {
        // Show both schedule lists side by side
        if (scheduleColManha) scheduleColManha.classList.remove('hidden');
        if (scheduleColTarde) scheduleColTarde.classList.remove('hidden');
        if (scheduleMediaManha) scheduleMediaManha.classList.add('hidden');
        if (scheduleMediaTarde) scheduleMediaTarde.classList.add('hidden');
      } else if (mode === 'manha') {
        // Show Morning Schedule on left + Morning Media Card on right
        if (scheduleColManha) scheduleColManha.classList.remove('hidden');
        if (scheduleColTarde) scheduleColTarde.classList.add('hidden');
        if (scheduleMediaManha) scheduleMediaManha.classList.remove('hidden');
        if (scheduleMediaTarde) scheduleMediaTarde.classList.add('hidden');
      } else if (mode === 'tarde') {
        // Show Afternoon Media Card on left + Afternoon Schedule on right
        if (scheduleColManha) scheduleColManha.classList.add('hidden');
        if (scheduleColTarde) scheduleColTarde.classList.remove('hidden');
        if (scheduleMediaManha) scheduleMediaManha.classList.add('hidden');
        if (scheduleMediaTarde) scheduleMediaTarde.classList.remove('hidden');
      }

      if (window.lucide) lucide.createIcons();
    });
  });

  // Activity Categories Filter
  const filterBtns = document.querySelectorAll('.activity-filter-btn');
  const activityItems = document.querySelectorAll('.activity-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active', 'bg-[#4A6B53]', 'text-white');
        b.classList.add('bg-[#FAF7F2]', 'text-[#3D342F]');
      });
      btn.classList.add('active', 'bg-[#4A6B53]', 'text-white');
      btn.classList.remove('bg-[#FAF7F2]', 'text-[#3D342F]');

      const category = btn.getAttribute('data-filter');
      activityItems.forEach((item) => {
        const itemCat = item.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
          item.classList.remove('hidden');
          item.classList.add('block');
        } else {
          item.classList.add('hidden');
          item.classList.remove('block');
        }
      });
    });
  });

  // Pedagogy Tabs Switcher
  const pedagogyTabs = document.querySelectorAll('.pedagogy-tab');
  const pedagogyPanes = document.querySelectorAll('.pedagogy-pane');

  pedagogyTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      pedagogyTabs.forEach((t) => {
        t.classList.remove('active', 'bg-[#D97757]', 'text-white');
        t.classList.add('bg-[#FAF7F2]', 'text-[#3D342F]');
      });
      tab.classList.add('active', 'bg-[#D97757]', 'text-white');
      tab.classList.remove('bg-[#FAF7F2]', 'text-[#3D342F]');

      const targetPane = tab.getAttribute('data-pane');
      pedagogyPanes.forEach((pane) => {
        if (pane.id === targetPane) {
          pane.classList.remove('hidden');
          pane.classList.add('block');
        } else {
          pane.classList.add('hidden');
          pane.classList.remove('block');
        }
      });
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
