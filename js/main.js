/**
 * KidsClub.daFonte - Main Application Logic
 * Integrates GSAP animations, interactive schedule, space lightbox,
 * pedagogy tabs, and dynamic enrollment calculator modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Sticky Header Shadow on Scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
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
    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // GSAP Animations setup
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Fade-in animated elements with scroll trigger
    gsap.utils.toArray('.gsap-reveal').forEach((elem) => {
      gsap.fromTo(
        elem,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Stagger animation for team cards and activity cards
    gsap.utils.toArray('.gsap-stagger-container').forEach((container) => {
      const cards = container.querySelectorAll('.gsap-stagger-item');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
          },
        }
      );
    });
  }

  // Schedule Switcher (Manhãs / Tardes / Ver Completo)
  const scheduleTabs = document.querySelectorAll('.schedule-tab');
  const scheduleContents = document.querySelectorAll('.schedule-content');

  scheduleTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      scheduleTabs.forEach((t) => t.classList.remove('active', 'bg-[#4A6B53]', 'text-white'));
      scheduleTabs.forEach((t) => t.classList.add('bg-white', 'text-[#3D342F]'));

      tab.classList.add('active', 'bg-[#4A6B53]', 'text-white');
      tab.classList.remove('bg-white', 'text-[#3D342F]');

      const target = tab.getAttribute('data-target');
      scheduleContents.forEach((content) => {
        if (target === 'all' || content.id === target) {
          content.classList.remove('hidden');
          content.classList.add('block');
        } else {
          content.classList.add('hidden');
          content.classList.remove('block');
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

  // Lightbox Modal for Space Adapting Images
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
    let basePrice = 350;

    if (plan === 'meio-dia') basePrice = 200;
    else if (plan === 'avulso') basePrice = 50;

    // Apply 10% sibling discount for 2+ kids
    let total = basePrice * kids;
    if (kids > 1 && plan !== 'avulso') {
      total = Math.round(total * 0.9);
    }

    if (plan === 'avulso') {
      calculatedPriceElem.textContent = `${total}€ / dia avulso`;
    } else {
      calculatedPriceElem.textContent = `${total}€ / mês ${kids > 1 ? '(com 10% de desconto de irmão)' : ''}`;
    }
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
      e.target === enrollmentModal && enrollmentModal.classList.add('hidden');
    });
  }

  if (enrollmentForm) {
    enrollmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successBox = document.getElementById('form-success-message');
      if (successBox) {
        enrollmentForm.classList.add('hidden');
        successBox.classList.remove('hidden');
      }
    });
  }
});

// Helper for quick copy of phone / email
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    alert(`${label} (${text}) copiado para a área de transferência!`);
  }).catch(() => {
    alert(`Contacto: ${text}`);
  });
}
