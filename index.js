// ----------------------------------------------------
// NOVA VISUALS 2026 INTERACTION SYSTEM
// ----------------------------------------------------
function initApp() {
  document.body.classList.remove('light-theme');
  localStorage.removeItem('theme');
  initLanguageToggle();
  initNavEvents();
  initRevealAnimations();
  initCustomVideoPlayer();
  initVideoSection();
  initJourneyMarquee();
  initPostersMarquee();
  initBrandingSlider();
  initBrandingLogosMarquee();
  initLightbox();
  initContactForm();
  initCustomCursor();
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
      if (!sectionId) return;
      const navLink = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);
      
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

  function buildMessage() {
    const name = nameInput ? nameInput.value.trim() : '';
    const company = companyInput ? companyInput.value.trim() : '';
    const service = serviceSelect ? serviceSelect.value : '';
    const budget = budgetSelect ? budgetSelect.value : '';
    const brief = briefInput ? briefInput.value.trim() : '';

    let lines = [];
    lines.push('Hello Yessine!');
    lines.push('');
    let intro = 'My name is *' + (name || '___') + '*';
    if (company) intro += ' from *' + company + '*';
    intro += '.';
    lines.push(intro);
    lines.push('');
    lines.push('Service needed: *' + (service || '___') + '*');
    if (budget) lines.push('Budget range: *' + budget + '*');
    lines.push('');
    lines.push('Project brief:');
    lines.push(brief || '___');
    lines.push('');
    lines.push('Looking forward to hearing from you!');

    return lines.join('\n');
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var msg = buildMessage();
    var encoded = encodeURIComponent(msg);
    var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encoded;

    // Open WhatsApp synchronously immediately to prevent browser popup blockers
    window.open(waUrl, '_blank');

    var btn = document.getElementById('wa-submit-btn');
    if (btn) {
      var origHTML = btn.innerHTML;
      btn.innerHTML = '<i class="ri-checkbox-circle-fill"></i> <span>Message Sent to WhatsApp!</span>';
      btn.style.background = 'linear-gradient(135deg, #00BFA5, #00E5FF)';

      setTimeout(function() {
        btn.innerHTML = origHTML;
        btn.style.background = '';
      }, 3000);
    }
  });
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
// PREMIERE FEATURED VIDEO SHOWCASE (LATEST WORK)
// ----------------------------------------------------
function initCustomVideoPlayer() {
  const playerFrame = document.getElementById('premiere-player');
  const video = document.getElementById('premiere-video');
  const playPill = document.getElementById('premiere-play-pill');
  const pillIcon = document.getElementById('premiere-pill-icon');
  const pillText = document.getElementById('premiere-pill-text');
  const playBtn = document.getElementById('premiere-play-btn');
  const playIcon = document.getElementById('p-play-icon');
  const muteBtn = document.getElementById('premiere-mute-btn');
  const muteIcon = document.getElementById('p-mute-icon');
  const timeline = document.getElementById('premiere-timeline');
  const timelineFill = document.getElementById('premiere-timeline-fill');
  const currTimeEl = document.getElementById('p-curr-time');
  const durTimeEl = document.getElementById('p-dur-time');
  const fsBtn = document.getElementById('premiere-fs-btn');
  const fsIcon = document.getElementById('p-fs-icon');

  if (!video || !playerFrame) return;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function togglePlay() {
    if (video.paused || video.ended) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  video.addEventListener('play', () => {
    playerFrame.classList.add('is-playing');
    if (playIcon) playIcon.className = 'ri-pause-fill';
    scheduleControlsHide();
  });

  video.addEventListener('pause', () => {
    playerFrame.classList.remove('is-playing');
    playerFrame.classList.remove('hide-controls');
    if (playIcon) playIcon.className = 'ri-play-fill';
    clearTimeout(hideControlsTimeout);
  });

  video.addEventListener('ended', () => {
    playerFrame.classList.remove('is-playing');
    playerFrame.classList.remove('hide-controls');
    if (playIcon) playIcon.className = 'ri-replay-line';
    if (pillIcon) pillIcon.className = 'ri-replay-line';
    if (pillText) pillText.textContent = 'Replay Teaser';
    clearTimeout(hideControlsTimeout);
  });

  if (playPill) {
    playPill.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  }

  playerFrame.addEventListener('click', (e) => {
    if (e.target.closest('#premiere-controls') || e.target.closest('#premiere-play-pill')) return;
    togglePlay();
  });

  // Timeline & Time update
  let isScrubbing = false;

  video.addEventListener('timeupdate', () => {
    if (!isScrubbing && video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      if (timelineFill) timelineFill.style.width = `${pct}%`;
      if (currTimeEl) currTimeEl.textContent = formatTime(video.currentTime);
    }
  });

  video.addEventListener('loadedmetadata', () => {
    if (durTimeEl && video.duration) {
      durTimeEl.textContent = formatTime(video.duration);
    }
  });

  if (video.duration && durTimeEl) {
    durTimeEl.textContent = formatTime(video.duration);
  }

  function scrub(e) {
    if (!timeline || !video.duration) return;
    const rect = timeline.getBoundingClientRect();
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (timelineFill) timelineFill.style.width = `${pos * 100}%`;
    video.currentTime = pos * video.duration;
    if (currTimeEl) currTimeEl.textContent = formatTime(video.currentTime);
  }

  if (timeline) {
    timeline.addEventListener('mousedown', (e) => {
      isScrubbing = true;
      scrub(e);
      const onMouseMove = (moveEvent) => {
        if (isScrubbing) scrub(moveEvent);
      };
      const onMouseUp = () => {
        isScrubbing = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    timeline.addEventListener('touchstart', (e) => {
      isScrubbing = true;
      scrub(e);
    }, { passive: true });

    timeline.addEventListener('touchmove', (e) => {
      if (isScrubbing) scrub(e);
    }, { passive: true });

    timeline.addEventListener('touchend', () => {
      isScrubbing = false;
    });
  }

  // Mute / Unmute
  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      if (muteIcon) {
        muteIcon.className = video.muted ? 'ri-volume-mute-fill' : 'ri-volume-up-fill';
      }
    });
  }

  // Fullscreen
  if (fsBtn) {
    fsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFullscreen();
    });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (playerFrame.requestFullscreen) {
        playerFrame.requestFullscreen();
      } else if (playerFrame.webkitRequestFullscreen) {
        playerFrame.webkitRequestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      }
      if (fsIcon) fsIcon.className = 'ri-fullscreen-exit-line';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      if (fsIcon) fsIcon.className = 'ri-fullscreen-line';
    }
  }

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && fsIcon) {
      fsIcon.className = 'ri-fullscreen-line';
    }
  });

  // Auto-hide controls
  let hideControlsTimeout = null;
  function scheduleControlsHide() {
    clearTimeout(hideControlsTimeout);
    playerFrame.classList.remove('hide-controls');
    if (!video.paused) {
      hideControlsTimeout = setTimeout(() => {
        playerFrame.classList.add('hide-controls');
      }, 2500);
    }
  }

  playerFrame.addEventListener('mousemove', scheduleControlsHide);
  playerFrame.addEventListener('touchstart', scheduleControlsHide, { passive: true });
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
    nav_latest_work: "Latest Work",
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
    latest_work_badge: "LATEST RELEASE • 2026",
    latest_work_title: "LATEST WORK",
    latest_work_subtitle: "Official Launch Campaign Teaser & 3D Motion Graphics Identity for TecWeek 3.0",
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
    nav_latest_work: "Dernier Projet",
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
    latest_work_badge: "DERNIÈRE SORTIE • 2026",
    latest_work_title: "LATEST WORK",
    latest_work_subtitle: "Teaser officiel de lancement et identité motion design 3D pour TecWeek 3.0",
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
    const toggleFunc = () => {
      const currentLang = localStorage.getItem('lang') || 'en';
      const newLang = currentLang === 'en' ? 'fr' : 'en';
      setLanguage(newLang);
    };
    langPill.addEventListener('click', toggleFunc);
    langPill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFunc();
      }
    });
  }
}

// ----------------------------------------------------
// CUSTOM CURSOR
// ----------------------------------------------------
function initCustomCursor() {
  // Skip on touch devices
  if (!window.matchMedia('(hover: hover)').matches) return;

  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  var mouseX = -100, mouseY = -100;
  var ringX = -100, ringY = -100;
  var isVisible = false;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      isVisible = true;
    }
  });

  document.addEventListener('mouseleave', function() {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    isVisible = false;
  });

  document.addEventListener('mouseenter', function() {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
    isVisible = true;
  });

  // Click feedback
  document.addEventListener('mousedown', function() {
    dot.classList.add('is-clicking');
    ring.classList.add('is-clicking');
  });
  document.addEventListener('mouseup', function() {
    dot.classList.remove('is-clicking');
    ring.classList.remove('is-clicking');
  });

  // Hover detection on interactive elements
  var hoverTargets = 'a, button, input, textarea, select, .poster-card, .video-filter-btn, .social-card, .premiere-card, .premiere-play-pill, .p-ctrl-btn, .btn-video-launch, .nav__link, .dot, [role="button"]';

  document.addEventListener('mouseover', function(e) {
    if (e.target.closest(hoverTargets)) {
      dot.classList.add('is-hovering');
      ring.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest(hoverTargets)) {
      dot.classList.remove('is-hovering');
      ring.classList.remove('is-hovering');
    }
  });

  // Animation loop — dot snaps instantly, ring trails smoothly
  function animate() {
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';

    // Lerp the ring position for a trailing effect
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';

    requestAnimationFrame(animate);
  }
  animate();
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
