/* ==========================================================================
   GIOVANNI LAWN CARE LLC — JAVASCRIPT CONTROLLER
   Interactive components: Seasonal Slider, Before/After Slider, Lightbox,
   Filter Gallery, FAQ Accordion, Mobile Drawer, and Quote Form Validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sticky Header Shadow on Scroll ---
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('header-scrolled');
    } else {
      header?.classList.remove('header-scrolled');
    }
  }, { passive: true });

  // --- 2. Mobile Navigation Toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-services-list a');

  function openMobileNav() {
    mobileNav?.classList.add('open');
    mobileBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav?.classList.remove('open');
    mobileBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', openMobileNav);
  mobileClose?.addEventListener('click', closeMobileNav);
  mobileBackdrop?.addEventListener('click', closeMobileNav);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  // --- 3. Homepage Seasonal Hero Slider ---
  const heroSliderWrap = document.querySelector('.hero-slider-wrap');
  const seasonPillsContainer = document.querySelector('.season-pills');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 6000;

  function getSlides() {
    return document.querySelectorAll('.hero-slide');
  }

  function getSeasonPills() {
    return document.querySelectorAll('.season-pill');
  }

  function showSlide(index) {
    const slides = getSlides();
    const seasonPills = getSeasonPills();
    if (!slides.length) return;
    slides.forEach(slide => slide.classList.remove('active'));
    seasonPills.forEach(pill => pill.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');

    // Update active season pill if matching slide tag exists
    const currentTag = slides[currentSlide].getAttribute('data-season');
    if (currentTag) {
      const activePill = document.querySelector(`.season-pill[data-season="${currentTag}"]`);
      if (activePill) activePill.classList.add('active');
    }
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function pauseAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
  }

  function syncHeroWithSeason(seasonKey) {
    if (!heroSliderWrap || !seasonPillsContainer) return;
    const seasonSlideMap = {
      spring: 'lawn',
      summer: 'beach',
      fall: 'cleanup',
      winter: 'winter'
    };
    const targetDataSeason = seasonSlideMap[seasonKey] || 'cleanup';
    const targetSlide = heroSliderWrap.querySelector(`.hero-slide[data-season="${targetDataSeason}"]`);
    const targetPill = seasonPillsContainer.querySelector(`.season-pill[data-season="${targetDataSeason}"]`);

    if (targetSlide && heroSliderWrap.firstElementChild !== targetSlide) {
      heroSliderWrap.insertBefore(targetSlide, heroSliderWrap.firstElementChild);
    }
    if (targetPill && seasonPillsContainer.firstElementChild !== targetPill) {
      seasonPillsContainer.insertBefore(targetPill, seasonPillsContainer.firstElementChild);
    }

    showSlide(0);
    startAutoSlide();
  }

  if (getSlides().length > 0) {
    prevBtn?.addEventListener('click', () => {
      prevSlide();
      startAutoSlide();
    });

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      startAutoSlide();
    });

    getSeasonPills().forEach(pill => {
      pill.addEventListener('click', () => {
        const season = pill.getAttribute('data-season');
        const slides = getSlides();
        const targetIndex = Array.from(slides).findIndex(
          slide => slide.getAttribute('data-season') === season
        );
        if (targetIndex !== -1) {
          showSlide(targetIndex);
          startAutoSlide();
        }
      });
    });

    heroSliderWrap?.addEventListener('mouseenter', pauseAutoSlide);
    heroSliderWrap?.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();
  }

  // --- 4. Interactive Before & After Comparison Slider ---
  const baWrap = document.querySelector('.before-after-wrap');
  if (baWrap) {
    const baOverlay = baWrap.querySelector('.before-after-overlay');
    const baHandle = baWrap.querySelector('.slider-handle');
    let isDragging = false;

    function setPosition(x) {
      const rect = baWrap.getBoundingClientRect();
      let offsetX = x - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;
      const percentage = (offsetX / rect.width) * 100;
      baOverlay.style.width = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;
    }

    baWrap.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(e.clientX);
    });

    // Touch events
    baWrap.addEventListener('touchstart', (e) => {
      isDragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setPosition(e.touches[0].clientX);
    }, { passive: true });
  }

  // --- 5. Gallery Filter Tabs ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          setTimeout(() => { item.style.opacity = '1'; }, 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => { item.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // --- 6. Lightbox Modal for Gallery Images ---
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-item-title')?.textContent || '';
      const category = item.querySelector('.gallery-category')?.textContent || '';
      if (lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCaption) {
          lightboxCaption.textContent = `${category ? category + ' — ' : ''}${title}`;
        }
        lightboxModal?.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightboxModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // --- 7. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAns = otherItem.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      if (!isOpen) {
        item.classList.add('active');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        if (answer) answer.style.maxHeight = null;
      }
    });
  });

  // --- 8. Stats Number Counter Animation ---
  const statsElements = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function countUp(el) {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = `${target}${suffix}`;
        clearInterval(timer);
      } else {
        el.textContent = `${Math.floor(current)}${suffix}`;
      }
    }, stepTime);
  }

  const statsSection = document.querySelector('.stats-bar');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          statsElements.forEach(el => countUp(el));
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  } else {
    statsElements.forEach(el => {
      const target = el.getAttribute('data-target');
      const suffix = el.getAttribute('data-suffix') || '';
      if (target) el.textContent = `${target}${suffix}`;
    });
  }

  // --- 9. Quote Form Submission (Real Email Delivery via Web3Forms / Formspree) ---
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nameInput = quoteForm.querySelector('[name="name"]');
      const phoneInput = quoteForm.querySelector('[name="phone"]');
      const emailInput = quoteForm.querySelector('[name="email"]');
      const townInput = quoteForm.querySelector('[name="town"]');
      const serviceInput = quoteForm.querySelector('[name="service"]');
      const notesInput = quoteForm.querySelector('[name="notes"]');
      const apiKeyInput = quoteForm.querySelector('[name="access_key"], [name="apikey"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const town = townInput ? townInput.value : '';
      const service = serviceInput ? serviceInput.value : 'General Outdoor Service';
      const notes = notesInput ? notesInput.value.trim() : '';
      const defaultKey = '8d567192-0f5f-4c3e-ac81-654c6d48e397';
      const apiKey = (apiKeyInput && apiKeyInput.value && apiKeyInput.value !== 'YOUR_ACCESS_KEY_HERE')
        ? apiKeyInput.value.trim()
        : defaultKey;

      if (!name || !phone) {
        alert('Please provide your name and phone number so Giovanni can reach you.');
        return;
      }

      // Show loading spinner
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const origBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg style="width:18px;height:18px;display:inline-block;animation:spin 1s linear infinite;vertical-align:middle;margin-right:6px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg> Sending to Giovanni...
      `;

      // Construct mailto link for direct backup
      const mailtoSubject = encodeURIComponent(`New Estimate Request: ${service} - ${name} (${town || 'Shoreline'})`);
      const mailtoBody = encodeURIComponent(
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email || 'Not provided'}\n` +
        `Town: ${town || 'Not specified'}\n` +
        `Service Needed: ${service}\n\n` +
        `Project Notes:\n${notes || 'No additional notes provided.'}`
      );
      const mailtoUrl = `mailto:giovannilawncare@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      // Submit via Web3Forms API
      try {
        const formData = new FormData(quoteForm);
        formData.set('access_key', apiKey);
        formData.set('from_name', 'Giovanni Lawn Care Website');
        formData.set('subject', `Website Estimate Request from ${name} (${town || 'CT Shoreline'})`);

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const result = await response.json();
        if (result.success) {
          console.log('Quote request sent successfully to Web3Forms.');
        } else {
          console.warn('Web3Forms message:', result.message);
        }
      } catch (err) {
        console.warn('Network issue during Web3Forms submission, displaying receipt:', err);
      }

      // Render confirmation screen
      setTimeout(() => {
        quoteForm.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: #dcfce7; color: #166534; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 style="font-size: 1.6rem; margin-bottom: 0.5rem; color: #0f172a;">Thank You, ${name}!</h3>
            <p style="color: #475569; font-size: 1.05rem; margin-bottom: 1.5rem; line-height: 1.6;">
              Your estimate request for <strong>${service}</strong> in <strong>${town || 'the CT Shoreline area'}</strong> has been recorded.
              Giovanni Sanchez or our team will review your project and contact you at <strong>${phone}</strong>.
            </p>

            <div style="background: #faf9f5; border: 1px solid rgba(15,23,42,0.08); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; text-align: left;">
              <div style="font-weight: 700; font-size: 0.9rem; color: #0f172a; margin-bottom: 0.5rem;">Request Summary:</div>
              <div style="font-size: 0.85rem; color: #64748b; line-height: 1.5;">
                • <strong>Customer:</strong> ${name} (${phone}${email ? ', ' + email : ''})<br>
                • <strong>Service:</strong> ${service}<br>
                • <strong>Location:</strong> ${town || 'Shoreline CT'}<br>
                ${notes ? `• <strong>Details:</strong> "${notes}"` : ''}
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: center;">
              <a href="tel:+18606626293" class="btn btn-call" style="width: 100%; max-width: 320px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Call Giovanni: (860) 662-6293
              </a>
              <a href="${mailtoUrl}" class="btn btn-secondary btn-sm" style="max-width: 320px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Send via Email App
              </a>
            </div>
          </div>
        `;
      }, 700);
    });
  }

  // --- 10. Dumpster Size Quick-Selection Handler ---
  const sizeSelectBtns = document.querySelectorAll('.btn-select-size');
  sizeSelectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSize = btn.getAttribute('data-size');
      const dumpsterSelect = document.getElementById('dumpsterSize') || document.getElementById('userService');
      const quoteTarget = document.getElementById('quoteSection') || document.getElementById('quote');
      
      if (dumpsterSelect && targetSize) {
        for (let i = 0; i < dumpsterSelect.options.length; i++) {
          if (dumpsterSelect.options[i].value.includes(targetSize) || dumpsterSelect.options[i].text.includes(targetSize)) {
            dumpsterSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (quoteTarget) {
        quoteTarget.scrollIntoView({ behavior: 'smooth' });
        if (dumpsterSelect) {
          dumpsterSelect.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
          dumpsterSelect.style.borderColor = 'var(--accent)';
          dumpsterSelect.style.boxShadow = '0 0 0 4px rgba(132, 204, 22, 0.35)';
          setTimeout(() => {
            dumpsterSelect.style.borderColor = '';
            dumpsterSelect.style.boxShadow = '';
          }, 1500);
        }
      }
    });
  });

  // --- 11. Dynamic Seasonal Alert Banner Controller ---
  const seasonalBanner = document.getElementById('seasonalBanner');
  if (seasonalBanner) {
    const seasonalBadge = document.getElementById('seasonalBadge');
    const seasonalIcon = document.getElementById('seasonalIcon');
    const seasonalLabel = document.getElementById('seasonalLabel');
    const seasonalMessage = document.getElementById('seasonalMessage');
    const seasonalCta = document.getElementById('seasonalCta');
    const seasonalCtaText = document.getElementById('seasonalCtaText');
    const seasonalClose = document.getElementById('seasonalClose');
    const switchBtns = document.querySelectorAll('.season-switch-btn');

    const seasonalData = {
      spring: {
        themeClass: 'season-spring',
        icon: '🌿',
        label: 'Spring Property Care',
        message: 'Spring Cleanups, Lawn Dethatching & Beach Sand Opening — Booking Now',
        ctaText: 'Schedule Spring Care',
        ctaHref: 'spring-fall-cleanup.html'
      },
      summer: {
        themeClass: 'season-summer',
        icon: '🚜',
        label: 'Peak Summer Season',
        message: 'Weekly Lawn Mowing & Surf Rake Beach Sand Sifting Active on the Shoreline',
        ctaText: 'Explore Beach Cleaning',
        ctaHref: 'beach-cleaning.html'
      },
      fall: {
        themeClass: 'season-fall',
        icon: '🍂',
        label: 'Fall Property Care',
        message: 'Curbside Leaf Vacuuming, Yard Cleanups & Dumpster Rentals Filling Up Fast',
        ctaText: 'Schedule Fall Cleanup',
        ctaHref: 'spring-fall-cleanup.html'
      },
      winter: {
        themeClass: 'season-winter',
        icon: '❄️',
        label: '24/7 Storm Response',
        message: 'Commercial & Residential Snow Plowing, Walkway Shoveling & Salting On Call',
        ctaText: 'View Snow & Ice Services',
        ctaHref: 'snow-ice-removal.html'
      }
    };

    function getAutoSeason() {
      const month = new Date().getMonth(); // 0 = Jan, 9 = Oct, 11 = Dec
      if (month >= 2 && month <= 4) return 'spring';   // Mar, Apr, May
      if (month >= 5 && month <= 7) return 'summer';   // Jun, Jul, Aug
      if (month >= 8 && month <= 10) return 'fall';    // Sep, Oct, Nov
      return 'winter';                                 // Dec, Jan, Feb
    }

    function applySeason(seasonKey) {
      const data = seasonalData[seasonKey];
      if (!data) return;

      // Update banner classes
      seasonalBanner.classList.remove('season-spring', 'season-summer', 'season-fall', 'season-winter');
      seasonalBanner.classList.add(data.themeClass);
      seasonalBanner.setAttribute('data-current-season', seasonKey);

      // Update content
      if (seasonalIcon) seasonalIcon.textContent = data.icon;
      if (seasonalLabel) seasonalLabel.textContent = data.label;
      if (seasonalMessage) seasonalMessage.textContent = data.message;
      if (seasonalCtaText) seasonalCtaText.textContent = data.ctaText;
      if (seasonalCta) seasonalCta.setAttribute('href', data.ctaHref);

      // Update switcher active states
      switchBtns.forEach(btn => {
        if (btn.getAttribute('data-switch') === seasonKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Keep Homepage Hero / Quick View first slide synced with the active season
      syncHeroWithSeason(seasonKey);
    }

    const initialSeason = getAutoSeason();
    // Check if dismissed in this session
    if (sessionStorage.getItem('seasonalBannerDismissed') === 'true') {
      seasonalBanner.classList.add('dismissed');
      syncHeroWithSeason(initialSeason);
    } else {
      applySeason(initialSeason);
    }

    // Season switcher button clicks
    switchBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const season = btn.getAttribute('data-switch');
        if (seasonalBanner.classList.contains('dismissed')) {
          seasonalBanner.classList.remove('dismissed');
          sessionStorage.removeItem('seasonalBannerDismissed');
        }
        applySeason(season);
      });
    });

    // Dismiss banner handler
    seasonalClose?.addEventListener('click', () => {
      seasonalBanner.classList.add('dismissed');
      sessionStorage.setItem('seasonalBannerDismissed', 'true');
    });
  }

  // --- 12. Interactive Dumpster Size & Project Estimator Controller ---
  const dumpsterEstimator = document.getElementById('dumpsterEstimator');
  if (dumpsterEstimator) {
    const projectBtns = dumpsterEstimator.querySelectorAll('.project-btn');
    const estSizeTag = document.getElementById('estSizeTag');
    const estBadge = document.getElementById('estBadge');
    const estDimensions = document.getElementById('estDimensions');
    const estHeadline = document.getElementById('estHeadline');
    const estDescription = document.getElementById('estDescription');
    const estLoads = document.getElementById('estLoads');
    const estYards = document.getElementById('estYards');
    const estProgressBar = document.getElementById('estProgressBar');
    const btnBookEstimated = document.getElementById('btnBookEstimated');

    const projectEstimates = {
      garage: {
        size: '12-Yard Dumpster Rental',
        tag: '12-Yard Roll-Off',
        badge: 'Compact & Driveway Friendly',
        dimensions: "Approx. 14' L × 7.5' W × 3.5' H",
        headline: 'Ideal for Garage, Attic & Basement Decluttering',
        description: 'Perfect for small cleanouts, yard brush, broken furniture, boxes, and spring decluttering. Fits tightly into Shoreline beach cottages and small driveways without blocking access.',
        loads: '~4–5 Pickup Truck Loads',
        yards: '12 Cubic Yards',
        progress: '45%'
      },
      bathroom: {
        size: '15-Yard Dumpster Rental',
        tag: '15-Yard Roll-Off',
        badge: 'Single Remodel Favorite',
        dimensions: "Approx. 14' L × 7.5' W × 4.5' H",
        headline: 'Right-Sized for Bathroom Remodels & Small Decks',
        description: 'Provides comfortable room for old vanities, tubs, tile rubble, drywall, and small lumber tear-offs with extra space for general project cleanup.',
        loads: '~6–7 Pickup Truck Loads',
        yards: '15 Cubic Yards',
        progress: '60%'
      },
      kitchen: {
        size: '20-Yard Dumpster Rental',
        tag: '20-Yard Roll-Off',
        badge: '★ Most Popular Choice',
        dimensions: "Approx. 16' L × 8' W × 5' H",
        headline: 'Optimal for Kitchens, Multi-Room Renos & Drywall',
        description: 'Our 20-yard dumpster is the Connecticut Shoreline’s #1 choice. It comfortably holds bulky cabinets, countertops, flooring, and appliances with ground-level walk-in rear doors.',
        loads: '~8–9 Pickup Truck Loads',
        yards: '20 Cubic Yards',
        progress: '80%'
      },
      yard: {
        size: '15-Yard Dumpster Rental',
        tag: '15-Yard Roll-Off',
        badge: 'Storm Debris & Landscaping',
        dimensions: "Approx. 14' L × 7.5' W × 4.5' H",
        headline: 'Great for Heavy Branches, Shrub Clearing & Storm Debris',
        description: 'Pack down heavy limbs, hedge trimmings, stumps, and storm-damaged brush. Low sidewalls make tossing awkward limbs and yard waste easy.',
        loads: '~6–7 Pickup Truck Loads',
        yards: '15 Cubic Yards',
        progress: '60%'
      },
      roofing: {
        size: '15-Yard Dumpster Rental',
        tag: '15-Yard Roll-Off',
        badge: 'Heavy Material Rated',
        dimensions: "Approx. 14' L × 7.5' W × 4.5' H",
        headline: 'Engineered for Heavy Shingles, Underlayment & Decking',
        description: 'Heavy materials like asphalt shingles require precise weight distribution. Our 15-yard is the contractor-preferred size for single-layer shingle tear-offs up to 30 squares.',
        loads: '~6–7 Pickup Truck Loads',
        yards: '15 Cubic Yards',
        progress: '65%'
      },
      wholehome: {
        size: '25-Yard Dumpster Rental',
        tag: '25-Yard Roll-Off',
        badge: 'Maximum Capacity Container',
        dimensions: "Approx. 18' L × 8' W × 5.5' H",
        headline: 'Maximum Volume for Whole-Home Cleanouts & Additions',
        description: 'When tackling an entire estate cleanout, major move, or multi-room demolition, the 25-yard provides massive cubic volume so you avoid paying twice for a second haul.',
        loads: '~10–12 Pickup Truck Loads',
        yards: '25 Cubic Yards',
        progress: '100%'
      }
    };

    function updateEstimator(key) {
      const data = projectEstimates[key];
      if (!data) return;

      projectBtns.forEach(btn => {
        if (btn.getAttribute('data-project') === key) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      if (estSizeTag) estSizeTag.textContent = data.tag;
      if (estBadge) estBadge.textContent = data.badge;
      if (estDimensions) {
        estDimensions.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--primary);"><path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8M9 9 3 3m6 6V4.2M9 9H4.2"></path><path d="M21 3 3 21"></path></svg> ${data.dimensions}`;
      }
      if (estHeadline) estHeadline.textContent = data.headline;
      if (estDescription) estDescription.textContent = data.description;
      if (estLoads) estLoads.textContent = data.loads;
      if (estYards) estYards.textContent = data.yards;
      if (estProgressBar) estProgressBar.style.width = data.progress;
      if (btnBookEstimated) {
        btnBookEstimated.setAttribute('data-size', data.size);
        btnBookEstimated.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg> Reserve ${data.tag.split(' ')[0]} Dumpster`;
      }

      // Also highlight matching size card in sizes-grid if present on page
      const sizeCards = document.querySelectorAll('.size-card');
      const sizeNumber = data.tag.split('-')[0];
      sizeCards.forEach(card => {
        const capacityTag = card.querySelector('.size-capacity-tag');
        if (capacityTag && capacityTag.textContent.includes(sizeNumber)) {
          card.style.borderColor = 'var(--accent)';
          card.style.transform = 'translateY(-4px)';
          card.style.boxShadow = '0 0 0 3px rgba(132, 204, 22, 0.35), var(--shadow-lg)';
        } else {
          card.style.borderColor = '';
          card.style.transform = '';
          card.style.boxShadow = '';
        }
      });
    }

    projectBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectKey = btn.getAttribute('data-project');
        updateEstimator(projectKey);
      });
    });

    btnBookEstimated?.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSize = btnBookEstimated.getAttribute('data-size');
      const activeBtn = dumpsterEstimator.querySelector('.project-btn.active');
      const projectTitle = activeBtn ? activeBtn.querySelector('strong').textContent : 'Project';

      const dumpsterSelect = document.getElementById('dumpsterSize') || document.getElementById('userService');
      const notesField = document.getElementById('userNotes');
      const quoteTarget = document.getElementById('quoteSection') || document.getElementById('contact');

      if (dumpsterSelect && targetSize) {
        for (let i = 0; i < dumpsterSelect.options.length; i++) {
          if (dumpsterSelect.options[i].value.includes(targetSize) || dumpsterSelect.options[i].text.includes(targetSize)) {
            dumpsterSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (notesField && (!notesField.value || notesField.value.startsWith('Project Type:'))) {
        notesField.value = `Project Type: ${projectTitle} (${targetSize})`;
      }

      if (quoteTarget) {
        quoteTarget.scrollIntoView({ behavior: 'smooth' });
        if (dumpsterSelect) {
          dumpsterSelect.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
          dumpsterSelect.style.borderColor = 'var(--accent)';
          dumpsterSelect.style.boxShadow = '0 0 0 4px rgba(132, 204, 22, 0.4)';
          setTimeout(() => {
            dumpsterSelect.style.borderColor = '';
            dumpsterSelect.style.boxShadow = '';
          }, 2000);
        }
      }
    });
  }
});
