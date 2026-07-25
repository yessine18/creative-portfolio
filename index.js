// ----------------------------------------------------
// NOVA VISUALS 2026 INTERACTION SYSTEM
// ----------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  initNavEvents();
  initRevealAnimations();
  initJourneyMarquee();
  initPostersMarquee();
  initBrandingSlider();
  initBrandingLogosMarquee();
  initLightbox();
  initContactForm();
});

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
  
  function scrollActive() {
    const scrollY = window.pageYOffset;
    
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
  window.addEventListener('scroll', scrollActive);
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
    
    el.dataset.delay = sectionChildIndex * 120;
    sectionChildIndex++;
    
    observer.observe(el);
  });
  
  requestAnimationFrame(() => {
    const heroElements = document.querySelectorAll('.hero .reveal-left, .hero .reveal-right, .hero .reveal, .hero .reveal-scale');
    heroElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('active');
      }, 200 + i * 200);
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
  
  if (!track || !prevBtn || !nextBtn) return;
  
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
  
  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
  }
  
  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    updateSlider();
  }
  
  prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
  });
  
  nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
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
    const trigger = e.target.closest('.lightbox-trigger');
    if (trigger) {
      const innerImg = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
      const imgUrl = innerImg ? innerImg.src : trigger.dataset.img;
      const imgAlt = (innerImg ? innerImg.alt : null) || 'Showcase Image';
      
      if (imgUrl) {
        lightboxImg.src = imgUrl;
        lightboxImg.alt = imgAlt;
        lightbox.classList.add('active');
      }
    }
  });
  
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
  
  function closeLightbox() {
    lightbox.classList.remove('active');
  }
}

// ----------------------------------------------------
// CONTACT FORM MOCK SUBMIT
// ----------------------------------------------------
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      const origText = btn.innerHTML;
      btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Sending Brief...';
      btn.disabled = true;
      
      setTimeout(() => {
        btn.innerHTML = '<i class="ri-checkbox-circle-fill"></i> Brief Received!';
        btn.style.background = 'linear-gradient(135deg, #00BFA5 0%, #00E5FF 100%)';
        form.reset();
        
        setTimeout(() => {
          btn.innerHTML = origText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }, 1200);
    }
  });
}

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
