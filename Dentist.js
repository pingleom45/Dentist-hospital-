/**
 * Apex Dental Care - Interactive Core Script
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Dynamic Footer Copyright Year
  // ==========================================
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ==========================================
  // 2. Header Scroll Effect
  // ==========================================
  const header = document.getElementById('header');
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 3. Navigation Links Active Scroll Sync
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}` || (current === 'home' && href === '#')) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 4. Hamburger Mobile Navigation Menu
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when links are clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 5. Dark Mode / Light Mode Theme System
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Check cached preference or fallback to system settings
  const cachedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (cachedTheme === 'dark' || (!cachedTheme && prefersDark)) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      
      const isDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // ==========================================
  // 6. Testimonials Slider
  // ==========================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');
  let currentSlide = 0;
  let slideInterval;

  if (slides.length > 0) {
    // Dynamically create dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    const updateSlider = () => {
      slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        dots[idx].classList.remove('active');
      });
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlider();
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateSlider();
    };

    const goToSlide = (index) => {
      currentSlide = index;
      updateSlider();
      resetInterval();
    };

    const startInterval = () => {
      slideInterval = setInterval(nextSlide, 5000);
    };

    const resetInterval = () => {
      clearInterval(slideInterval);
      startInterval();
    };

    if (prevBtn && nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
      });
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
      });
    }

    // Auto-scroll testimonials
    startInterval();
  }

  // ==========================================
  // 7. FAQ Accordion Toggle
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const faqHeader = item.querySelector('.faq-header');
    if (faqHeader) {
      faqHeader.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all open FAQs
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });

        // Toggle clicked FAQ
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ==========================================
  // 8. Smile Assessment Quiz State Machine
  // ==========================================
  const quizBox = document.getElementById('quiz-box');
  if (quizBox) {
    let quizState = {
      step: 1,
      goal: '',
      lastVisit: '',
      name: '',
      email: ''
    };

    const quizSteps = document.querySelectorAll('.quiz-step');
    const progressBar = document.getElementById('quiz-progress-bar');
    const prevQuizBtn = document.getElementById('quiz-prev-btn');
    const nextQuizBtn = document.getElementById('quiz-next-btn');

    // Goal selections (Step 1)
    const step1Options = quizSteps[0].querySelectorAll('.quiz-option');
    step1Options.forEach(opt => {
      opt.addEventListener('click', () => {
        step1Options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        quizState.goal = opt.getAttribute('data-value');
      });
    });

    // Cleaning frequency selections (Step 2)
    const step2Options = quizSteps[1].querySelectorAll('.quiz-option');
    step2Options.forEach(opt => {
      opt.addEventListener('click', () => {
        step2Options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        quizState.lastVisit = opt.getAttribute('data-value');
      });
    });

    const updateQuizUI = () => {
      // Toggle step visibility
      quizSteps.forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.getAttribute('data-step')) === quizState.step) {
          step.classList.add('active');
        }
      });

      // Update progress bar
      const progressPercent = ((quizState.step - 1) / 3) * 100;
      progressBar.style.width = `${progressPercent}%`;

      // Update Navigation Buttons
      if (quizState.step === 1) {
        prevQuizBtn.disabled = true;
        nextQuizBtn.textContent = 'Next Step';
      } else if (quizState.step === 3) {
        prevQuizBtn.disabled = false;
        nextQuizBtn.textContent = 'Get Results';
      } else if (quizState.step === 4) {
        // Hide navigation once results are loaded
        document.getElementById('quiz-nav').style.display = 'none';
        renderQuizRecommendation();
      } else {
        prevQuizBtn.disabled = false;
        nextQuizBtn.textContent = 'Next Step';
      }
    };

    const renderQuizRecommendation = () => {
      const resultTitle = document.getElementById('result-title');
      const recBox = document.getElementById('quiz-recommendation-box');
      
      const userName = document.getElementById('quiz-name').value || 'Friend';
      resultTitle.textContent = `Hey ${userName}, here is your personalized smile plan!`;
      
      let recHtml = '';
      
      // Determine recommendation based on Goal selection
      switch (quizState.goal) {
        case 'whitening':
          recHtml = `
            <h4>Recommended: Clinical Teeth Whitening & Veneers</h4>
            <p>To lift deep stains and brighten your smile, our <strong>Laser Laser-Whitening Therapy</strong> can safely brighten your teeth up to 8 shades in a single 60-minute visit. For permanent structural coloration, custom-designed <strong>Porcelain Veneers</strong> can reshape teeth contours flawlessly.</p>
          `;
          break;
        case 'ortho':
          recHtml = `
            <h4>Recommended: Clear Invisalign Aligners</h4>
            <p>If you're seeking straighter teeth alignment, our high-tech digital imaging lets us draft your entire <strong>Clear Invisalign</strong> tray series in one session. The aligners are virtually invisible and fit seamlessly into daily schedules.</p>
          `;
          break;
        case 'implants':
          recHtml = `
            <h4>Recommended: Biological Dental Implants</h4>
            <p>To restore missing spaces and structural chewing durability, our clinical titanium <strong>Dental Implants</strong> fuse directly with biological structures. We custom-top each post with a natural-looking zirconia crown.</p>
          `;
          break;
        default:
          recHtml = `
            <h4>Recommended: Comprehensive Exam & Restorations</h4>
            <p>If you are experiencing tooth pain, wear, or chips, we recommend a priority checkup with <strong>Dr. Ross</strong>. We'll identify exact causes and formulate localized restorations like bonding, crowns, or dental cleanings to secure pain-free chewing.</p>
          `;
      }

      // Add advice based on last visit frequency
      if (quizState.lastVisit === 'long' || quizState.lastVisit === 'neglect') {
        recHtml += `
          <p style="margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-color); font-size: 0.9rem; color: var(--text-muted);">
            <strong>Care Note:</strong> Since it has been over a year since your last scaling, we highly recommend scheduling a <strong>Preventive Hygiene Session</strong>. Catching plaque buildup early protects against permanent gum loss.
          </p>
        `;
      } else {
        recHtml += `
          <p style="margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-color); font-size: 0.9rem; color: var(--text-muted);">
            <strong>Care Note:</strong> Excellent work keeping on top of your periodic cleanings! A quick exam will confirm structural health and protect your enamel shine.
          </p>
        `;
      }

      recBox.innerHTML = recHtml;
    };

    nextQuizBtn.addEventListener('click', () => {
      // Validation per step
      if (quizState.step === 1 && !quizState.goal) {
        alert('Please choose one of the smile goals before proceeding.');
        return;
      }
      if (quizState.step === 2 && !quizState.lastVisit) {
        alert('Please select your last scaling frequency before proceeding.');
        return;
      }
      if (quizState.step === 3) {
        const nameVal = document.getElementById('quiz-name').value.trim();
        const emailVal = document.getElementById('quiz-email').value.trim();
        if (!nameVal || !emailVal) {
          alert('Please fill out both name and email fields.');
          return;
        }
        quizState.name = nameVal;
        quizState.email = emailVal;
      }

      quizState.step++;
      updateQuizUI();
    });

    prevQuizBtn.addEventListener('click', () => {
      if (quizState.step > 1) {
        quizState.step--;
        updateQuizUI();
      }
    });

    // Link booking button from Quiz
    const quizBookBtn = document.getElementById('quiz-book-btn');
    if (quizBookBtn) {
      quizBookBtn.addEventListener('click', () => {
        // Pre-fill fields in booking form from quiz
        const bookingName = document.getElementById('booking-name');
        const bookingEmail = document.getElementById('booking-email');
        const bookingService = document.getElementById('booking-service');

        if (bookingName) bookingName.value = quizState.name;
        if (bookingEmail) bookingEmail.value = quizState.email;
        
        if (bookingService) {
          if (quizState.goal === 'whitening') bookingService.value = 'Cosmetic Smile Makeover';
          else if (quizState.goal === 'ortho') bookingService.value = 'Orthodontics';
          else if (quizState.goal === 'implants') bookingService.value = 'Dental Implants';
          else bookingService.value = 'Preventive Dentistry';
        }
      });
    }
  }

  // ==========================================
  // 9. Appointment Booking Form Engine
  // ==========================================
  const bookingForm = document.getElementById('booking-form');
  const dateInput = document.getElementById('booking-date');
  const slotsGrid = document.getElementById('time-slots-grid');
  const timeHiddenInput = document.getElementById('booking-time');

  // Set minimum date picker values to today (cannot schedule in the past)
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // Generate available slots on Date change
  const standardSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const updateTimeSlots = (selectedDate) => {
    slotsGrid.innerHTML = '';
    timeHiddenInput.value = '';
    
    const dayOfWeek = new Date(selectedDate).getUTCDay();
    
    // Sundays closed
    if (dayOfWeek === 0) {
      slotsGrid.innerHTML = '<div class="time-slot-btn disabled" style="grid-column: 1 / -1;">Clinic is closed on Sundays</div>';
      return;
    }

    // Mock booking availability by dynamically disabling some slots using a simple seed based on date
    const dateSeed = new Date(selectedDate).getDate() || 1;

    standardSlots.forEach((slot, index) => {
      const btn = document.createElement('div');
      btn.classList.add('time-slot-btn');
      btn.textContent = slot;

      // Logic to disable slots (Saturday closes early; random seeded logic for weekdays)
      let isDisabled = false;
      if (dayOfWeek === 6 && index >= 4) {
        isDisabled = true; // Sat closes after 1 PM
      } else {
        // Pseudo-random slot disabling using the date seed
        isDisabled = (dateSeed + index) % 3 === 0;
      }

      if (isDisabled) {
        btn.classList.add('disabled');
        btn.title = 'Slot occupied';
      } else {
        btn.addEventListener('click', () => {
          // Deselect active slots
          const activeBtns = slotsGrid.querySelectorAll('.time-slot-btn.selected');
          activeBtns.forEach(b => b.classList.remove('selected'));
          
          btn.classList.add('selected');
          timeHiddenInput.value = slot;
        });
      }

      slotsGrid.appendChild(btn);
    });
  };

  if (dateInput) {
    dateInput.addEventListener('change', (e) => {
      updateTimeSlots(e.target.value);
    });
  }

  // Submit appointment details
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('booking-name').value.trim();
      const email = document.getElementById('booking-email').value.trim();
      const phone = document.getElementById('booking-phone').value.trim();
      const service = document.getElementById('booking-service').value;
      const date = dateInput.value;
      const time = timeHiddenInput.value;
      const notes = document.getElementById('booking-notes').value.trim();

      // Check fields validation
      if (!name || !email || !phone || !service || !date || !time) {
        alert('Please fill out all required fields and select an active time slot.');
        return;
      }

      // Check Email validation format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Save Booking local state
      const newBooking = { name, email, phone, service, date, time, notes, createdAt: new Date().toISOString() };
      const currentBookings = JSON.parse(localStorage.getItem('apex_bookings') || '[]');
      currentBookings.push(newBooking);
      localStorage.setItem('apex_bookings', JSON.stringify(currentBookings));

      // Trigger Confirmation Modal details
      document.getElementById('modal-patient-name').textContent = name;
      document.getElementById('modal-service').textContent = service;
      document.getElementById('modal-date').textContent = date;
      document.getElementById('modal-time').textContent = time;

      const modal = document.getElementById('success-modal');
      if (modal) {
        modal.style.display = 'flex';
      }

      // Reset form controls
      bookingForm.reset();
      slotsGrid.innerHTML = '<div class="time-slot-btn disabled" style="grid-column: 1 / -1;">Please select a date</div>';
      timeHiddenInput.value = '';
    });
  }

  // Modal Control Closures
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalOverlay = document.getElementById('success-modal');

  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.style.display = 'none';
    });

    // Close on overlay clicking
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
      }
    });
  }
});
