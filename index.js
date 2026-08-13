// ----------------------------------------------------
// NOVA VISUALS 2026 INTERACTION SYSTEM
// ----------------------------------------------------
function initApp() {
  document.body.classList.remove('light-theme');
  localStorage.removeItem('theme');
  initLanguageToggle();
  initNavEvents();
  initRevealAnimations();
  initVideoSection();
  initJourneyMarquee();
  initPostersMarquee();
  initBrandingSlider();
  initBrandingLogosMarquee();
  initLightbox();
  initContactForm();
}

// initApp is called at the bottom of the file after all declarations

// ----------------------------------------------------
// NAVIGATION BAR & ACTIVE LINK HIGHLIGHTING
// ----------------------------------------------------
function initNavEvents() {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
    });
  }
  
  if (navClose && navMenu) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  }
  
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('show-menu');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('show-menu')) {
      if (!navMenu.contains(e.target) && navToggle && !navToggle.contains(e.target)) {
        navMenu.classList.remove('show-menu');
      }
    }
  });
  
  // Highlight navigation links on scroll
  const sections = document.querySelectorAll('section[id]');
  const header = document.getElementById('header');

  function scrollActive() {
    const scrollY = window.pageYOffset;

    if (header) {
      header.classList.toggle('scroll-header', scrollY > 24);
    }

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav__menu a[href*=${sectionId}]`);
      
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active-link');
        } else {
          navLink.classList.remove('active-link');
        }
      }
    });
  }
  window.addEventListener('scroll', scrollActive, { passive: true });
  scrollActive();
}

// ----------------------------------------------------
// SCROLL REVEAL ANIMATIONS
// Smooth staggered section-by-section reveals
// ----------------------------------------------------
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        
        setTimeout(() => {
          el.classList.add('active');
        }, Number(delay));
        
        observer.unobserve(el);
      }
    });
  }, observerOptions);
  
  let currentSection = null;
  let sectionChildIndex = 0;
  
  reveals.forEach(el => {
    const parentSection = el.closest('section');
    if (parentSection !== currentSection) {
      currentSection = parentSection;
      sectionChildIndex = 0;
    }
    
    // Cap the stagger so dense sections still resolve quickly
    el.dataset.delay = Math.min(sectionChildIndex, 4) * 90;
    sectionChildIndex++;
    
    observer.observe(el);
  });
  
  requestAnimationFrame(() => {
    const heroElements = document.querySelectorAll('.hero .reveal-left, .hero .reveal-right, .hero .reveal, .hero .reveal-scale');
    heroElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('active');
      }, 120 + i * 110);
    });
  });
}

// ----------------------------------------------------
// CREATIVE JOURNEY — AUTO-SCROLLING MARQUEE
// ----------------------------------------------------
function initJourneyMarquee() {
  const track = document.getElementById('journey-marquee');
  if (!track) return;
  
  const cards = track.querySelectorAll('.journey-card-dash');
  if (!cards.length) return;
  
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });
}

// ----------------------------------------------------
// SOCIAL MEDIA POSTERS — DUAL DYNAMIC MARQUEES
// ----------------------------------------------------
function initPostersMarquee() {
  const track1 = document.getElementById('poster-track-1');
  const track2 = document.getElementById('poster-track-2');

  if (track1) {
    const cards1 = track1.querySelectorAll('.poster-card');
    cards1.forEach(card => {
      const clone = card.cloneNode(true);
      track1.appendChild(clone);
    });
  }

  if (track2) {
    const cards2 = track2.querySelectorAll('.poster-card');
    cards2.forEach(card => {
      const clone = card.cloneNode(true);
      track2.appendChild(clone);
    });
  }
}

// ----------------------------------------------------
// SOCIAL MEDIA EVENTS BRANDING CAROUSEL
// ----------------------------------------------------
function initBrandingSlider() {
  const track = document.getElementById('branding-track');
  const prevBtn = document.getElementById('branding-prev');
  const nextBtn = document.getElementById('branding-next');
  const dotsContainer = document.getElementById('branding-dots');
  const campaignTabs = document.querySelectorAll('.campaign-tab');
  
  if (!track) return;
  
  const slides = track.querySelectorAll('.branding-slide-item');
  if (!slides.length) return;
  
  let currentIndex = 0;
  const totalSlides = slides.length;
  
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = `dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  campaignTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const slideIndex = parseInt(tab.dataset.slide, 10);
      if (!isNaN(slideIndex)) {
        goToSlide(slideIndex);
      }
    });
  });
  
  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    if (campaignTabs.length) {
      campaignTabs.forEach((tab) => {
        const slideIndex = parseInt(tab.dataset.slide, 10);
        tab.classList.toggle('active', slideIndex === currentIndex);
      });
    }
  }
  
  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    updateSlider();
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
    });
  }

  // Touch Swipe Support for Mobile & Tablets
  let startX = 0;
  let dist = 0;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    dist = 0;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!startX) return;
    const currentX = e.touches[0].clientX;
    dist = currentX - startX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (Math.abs(dist) > 30) {
      if (dist < 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
    startX = 0;
    dist = 0;
  });
}

// ----------------------------------------------------
// LIGHTBOX MODAL FOR POSTERS (USES DELEGATION)
// ----------------------------------------------------
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  
  if (!lightbox || !lightboxImg) return;
  
  // Use event delegation for dynamically cloned poster triggers
  document.addEventListener('click', (e) => {
    // Ignore clicks on interactive buttons or links
    if (e.target.closest('button') || e.target.closest('a')) return;

    const trigger = e.target.closest('.lightbox-trigger');
    if (trigger) {
      const innerImg = trigger.querySelector('img') || (trigger.tagName === 'IMG' ? trigger : null);
      const imgUrl = innerImg ? innerImg.src : trigger.dataset.img;
      const imgAlt = (innerImg ? innerImg.alt : null) || 'Enlarged View';
      
      if (imgUrl) {
        lightboxImg.src = imgUrl;
        lightboxImg.alt = imgAlt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  });
  
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox')) {
      closeLightbox();
    }
  });
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// ----------------------------------------------------
// WHATSAPP CONTACT FORM
// ----------------------------------------------------
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const WHATSAPP_NUMBER = '21656646677';

  const nameInput = document.getElementById('wa-name');
  const companyInput = document.getElementById('wa-company');
  const serviceSelect = document.getElementById('wa-service');
  const budgetSelect = document.getElementById('wa-budget');
  const briefInput = document.getElementById('wa-brief');
  const previewBubble = document.getElementById('wa-preview-bubble');

  function buildMessage() {
    const name = nameInput ? nameInput.value.trim() : '';
    const company = companyInput ? companyInput.value.trim() : '';
    const service = serviceSelect ? serviceSelect.value : '';
    const budget = budgetSelect ? budgetSelect.value : '';
    const brief = briefInput ? briefInput.value.trim() : '';

    let msg = `👋 Hello Yessine!\n\n`;
    msg += `My name is *${name || '___'}*`;
    if (company) msg += ` from *${company}*`;
    msg += `.\n\n`;
    msg += `🎯 *Service needed:* ${service || '___'}\n`;
    if (budget) msg += `💰 *Budget range:* ${budget}\n`;
    msg += `\n📋 *Project brief:*\n${brief || '___'}\n\n`;
    msg += `Looking forward to hearing from you! 🚀`;

    return msg;
  }

  function updatePreview() {
    if (!previewBubble) return;
    const msg = buildMessage();
    // Convert markdown-style bold to HTML
    const html = msg
      .replace(/\*(.*?)\*/g, '<span class="wa-highlight">$1</span>')
      .replace(/\n/g, '<br>');
    previewBubble.innerHTML = `<p class="wa-preview-text">${html}</p>`;
  }

  // Live preview updates
  [nameInput, companyInput, briefInput].forEach(el => {
    if (el) el.addEventListener('input', updatePreview);
  });
  [serviceSelect, budgetSelect].forEach(el => {
    if (el) el.addEventListener('change', updatePreview);
  });

  // Submit → open WhatsApp
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = buildMessage();
    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    // Button animation
    const btn = document.getElementById('wa-submit-btn');
    if (btn) {
      const origHTML = btn.innerHTML;
      btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> <span>Opening WhatsApp...</span>';
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        window.open(waUrl, '_blank');
        btn.innerHTML = '<i class="ri-checkbox-circle-fill"></i> <span>Message Ready!</span>';
        btn.style.background = 'linear-gradient(135deg, #00BFA5, #00E5FF)';

        setTimeout(() => {
          btn.innerHTML = origHTML;
          btn.style.background = '';
          btn.style.pointerEvents = '';
        }, 3000);
      }, 800);
    }
  });

  // Initial preview
  updatePreview();
}

// ----------------------------------------------------
// ----------------------------------------------------
// BRANDING LOGOS MARQUEE CLONER
// ----------------------------------------------------
function initBrandingLogosMarquee() {
  const track = document.getElementById('branding-logos-track');
  if (!track) return;
  
  const boxes = track.querySelectorAll('.logo-box');
  if (!boxes.length) return;
  
  boxes.forEach(box => {
    const clone = box.cloneNode(true);
    track.appendChild(clone);
  });
}

// ----------------------------------------------------
// VIDEO PRODUCTIONS & REELS SHOWCASE (FILTER & EXPAND)
// ----------------------------------------------------
function initVideoSection() {
  const filterBtns = document.querySelectorAll('.video-filter-btn');
  const vCards = document.querySelectorAll('.v-card');
  const expandBtn = document.getElementById('video-expand-btn');
  const expandText = document.getElementById('expand-text');
  const expandIcon = document.getElementById('expand-icon');
  
  if (!vCards.length) return;
  
  let currentFilter = 'all';
  let isExpanded = false;
  const INITIAL_LIMIT = 6;
  
  function updateVideoVisibility() {
    let visibleCount = 0;
    
    vCards.forEach(card => {
      const cardBrand = card.dataset.brand;
      const matchesFilter = (currentFilter === 'all' || cardBrand === currentFilter);
      
      if (matchesFilter) {
        visibleCount++;
        if (currentFilter === 'all' && !isExpanded && visibleCount > INITIAL_LIMIT) {
          card.style.display = 'none';
        } else {
          card.style.display = 'flex';
        }
      } else {
        card.style.display = 'none';
      }
    });
    
    if (expandBtn) {
      if (currentFilter !== 'all') {
        expandBtn.parentElement.style.display = 'none';
      } else {
        expandBtn.parentElement.style.display = 'flex';
        if (isExpanded) {
          expandText.textContent = 'Show Less';
          expandIcon.className = 'ri-arrow-up-s-line';
        } else {
          expandText.textContent = `Show All ${vCards.length} Video Productions`;
          expandIcon.className = 'ri-arrow-down-s-line';
        }
      }
    }
  }
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      updateVideoVisibility();
    });
  });
  
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      updateVideoVisibility();
    });
  }
  
  // Initial run
  updateVideoVisibility();
}

// ----------------------------------------------------

// ----------------------------------------------------
// FRENCH & ENGLISH BILINGUAL TRANSLATION SYSTEM
// ----------------------------------------------------
const translations = {
  en: {
    nav_cover: "Cover",
    nav_softwares: "Softwares",
    nav_journey: "Journey",
    nav_videos: "Videos",
    nav_posters: "Posters",
    nav_branding: "Branding",
    nav_logos: "Logos",
    nav_connect: "Connect",
    nav_portfolio: "Portfolio",
    hero_title: "Audio Visual Artist",
    hero_bio: "Crafting end-to-end high-impact media campaigns, 3D motion graphics, brand identities, and video production for national-scale tech events & congresses across Tunisia.",
    hero_portfolio_cta: "Visit Professional Portfolio",
    hero_scroll: "Scroll Down",
    sw_title: "CREATIVE SOFTWARE STACK",
    sw_subtitle: "Industry-standard tools powering every pixel & frame",
    sw_cat1: "Graphic Design",
    sw_cat2: "Video & Audio Production",
    journey_title: "CREATIVE JOURNEY",
    journey_subtitle: "Leadership, awards, and media manager roles across national events",
    video_badge: "40+ PRODUCTIONS IN 2.5 YEARS",
    video_title: "VIDEO PRODUCTIONS",
    video_subtitle: "Aftermovies, 3D intro reveals, congress teasers & 17m giant screen main stage productions",
    posters_title: "SOCIAL MEDIA POSTERS",
    posters_subtitle: "Continuous infinite showcase of promotional designs — <strong class=\"highlight-orange\">100+ posters</strong> created across national campaigns (Hover to pause / Click to enlarge)",
    branding_title: "SOCIAL MEDIA EVENTS BRANDING",
    branding_subtitle: "Click a campaign tab or swipe left/right to view full event brand identity showcases",
    logos_title: "BRANDING LOGOS",
    connect_headline: "Let's Build<br>Something <span class=\"text-gradient\">Epic</span>",
    connect_sub: "Looking for an audio visual artist & media manager who speaks fluent tech and creative direction?",
    form_name: "Your Name or Agency",
    form_email: "Your Email Address",
    form_message: "Tell me about your project brief or campaign needs...",
    form_submit: "Send Project Brief",
    footer_rights: "© 2026 Yessine Fakhfakh. All Rights Reserved.",
    footer_portfolio: "Professional Portfolio"
  },
  fr: {
    nav_cover: "Accueil",
    nav_softwares: "Logiciels",
    nav_journey: "Parcours",
    nav_videos: "Vidéos",
    nav_posters: "Affiches",
    nav_branding: "Identité Visuelle",
    nav_logos: "Logos",
    nav_connect: "Contact",
    nav_portfolio: "Portfolio",
    hero_title: "Artiste Audiovisuel",
    hero_bio: "Conception de campagnes média à fort impact, motion design 3D, identités de marque et production vidéo pour des événements technologiques et congrès d'envergure nationale en Tunisie.",
    hero_portfolio_cta: "Visiter le Portfolio Professionnel",
    hero_scroll: "Défiler vers le bas",
    sw_title: "STACK DE LOGICIELS CRÉATIFS",
    sw_subtitle: "Des outils professionnels au service de chaque pixel et image",
    sw_cat1: "Design Graphique",
    sw_cat2: "Production Vidéo & Audio",
    journey_title: "PARCOURS CRÉATIF",
    journey_subtitle: "Leadership, prix et rôles de responsable média lors d'événements nationaux",
    video_badge: "40+ PRODUCTIONS EN 2.5 ANS",
    video_title: "PRODUCTIONS VIDÉO",
    video_subtitle: "Aftermovies, révélations 3D, teasers de congrès et productions pour écran géant de 17m",
    posters_title: "AFFICHES RÉSEAUX SOCIAUX",
    posters_subtitle: "Galerie continue de créations publicitaires — <strong class=\"highlight-orange\">Plus de 100 affiches</strong> conçues pour des campagnes nationales (Survoler pour mettre en pause / Clic pour agrandir)",
    branding_title: "BRANDING D'ÉVÉNEMENTIEL",
    branding_subtitle: "Cliquez sur un onglet de campagne ou balayez pour voir les identités visuelles complètes",
    logos_title: "LOGOS ET MARQUES",
    connect_headline: "Créons Ensemble<br>Quelque Chose d'<span class=\"text-gradient\">Épique</span>",
    connect_sub: "Vous recherchez un artiste audiovisuel et responsable média maîtrisant direction créative et univers tech ?",
    form_name: "Votre Nom ou Agence",
    form_email: "Votre Adresse Email",
    form_message: "Parlez-moi de votre projet ou de vos besoins de campagne...",
    form_submit: "Envoyer le Brief Projet",
    footer_rights: "© 2026 Yessine Fakhfakh. Tous droits réservés.",
    footer_portfolio: "Portfolio Professionnel"
  }
};

function updateLangPillUI(lang) {
  const langPill = document.getElementById('lang-toggle');
  const options = document.querySelectorAll('.lang-pill__option');
  
  // Update active option highlight
  options.forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });
  
  // Move slider via CSS class
  if (langPill) {
    langPill.classList.toggle('fr-active', lang === 'fr');
    langPill.title = lang === 'fr' ? 'Traduire en Anglais' : 'Translate to French';
  }
}

function setLanguage(lang) {
  const currentDict = translations[lang] || translations.en;
  
  // Update innerHTML for elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (currentDict[key]) {
      el.innerHTML = currentDict[key];
    }
  });
  
  // Update placeholders for inputs with data-i18n-ph
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (currentDict[key]) {
      el.placeholder = currentDict[key];
    }
  });
  
  updateLangPillUI(lang);
  localStorage.setItem('lang', lang);
}

function initLanguageToggle() {
  const langPill = document.getElementById('lang-toggle');
  const savedLang = localStorage.getItem('lang') || 'en';
  
  setLanguage(savedLang);
  
  if (langPill) {
    langPill.addEventListener('click', () => {
      const currentLang = localStorage.getItem('lang') || 'en';
      const newLang = currentLang === 'en' ? 'fr' : 'en';
      setLanguage(newLang);
    });
  }
}

// ----------------------------------------------------
// BOOTSTRAP — must be at the bottom so all const/let
// declarations (e.g. translations) are initialized
// ----------------------------------------------------
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
