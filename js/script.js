/* -------------------------------------------------------------
   TechNova IT Solutions - Interactivity & Logic Script
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       1. Sticky Header Control
       ========================================================== */
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load


    /* ==========================================================
       2. Mobile Navigation Toggle Menu
       ========================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    const body = document.body;

    const toggleMenu = () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        primaryNav.classList.toggle('open');
        
        // Prevent body scrolling when menu is open on mobile
        if (!isExpanded) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close mobile menu when nav link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (primaryNav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });


    /* ==========================================================
       3. Scrollspy (Active Navigation Link Highlighting)
       ========================================================== */
    const sections = document.querySelectorAll('section, footer');
    
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 100; // Offset for sticky header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // Initial run


    /* ==========================================================
       4. Portfolio Filtering Showcase
       ========================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add fade out animation class if needed or toggle visibility
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                    // Add slight entry animation
                    card.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });


    /* ==========================================================
       5. Client Testimonial Carousel
       ========================================================== */
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    };

    const nextSlide = () => {
        let index = currentSlide + 1;
        if (index >= slides.length) {
            index = 0;
        }
        showSlide(index);
    };

    // Initialize auto slide
    const startSlideShow = () => {
        slideInterval = setInterval(nextSlide, 6000); // Shift every 6 seconds
    };

    const stopSlideShow = () => {
        clearInterval(slideInterval);
    };

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlideShow();
            showSlide(index);
            startSlideShow(); // restart interval
        });
    });

    startSlideShow(); // Start carousel on load


    /* ==========================================================
       6. Quote & Consultation Modal Management
       ========================================================== */
    const modal = document.getElementById('quote-modal');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const quoteForm = document.getElementById('quote-form');
    const formSuccessBox = document.getElementById('form-success-box');
    const successCloseBtn = document.getElementById('success-close-btn');

    const openModal = (e) => {
        e.preventDefault();
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        body.style.overflow = 'hidden'; // Lock background scroll
    };

    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        body.style.overflow = ''; // Unlock background scroll
        
        // Reset form states after close transitions
        setTimeout(() => {
            quoteForm.reset();
            quoteForm.style.opacity = '1';
            quoteForm.style.pointerEvents = 'auto';
            formSuccessBox.classList.remove('show');
        }, 300);
    };

    // Bind event listeners to open buttons
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    closeModalBtn.addEventListener('click', closeModal);
    successCloseBtn.addEventListener('click', closeModal);

    // Close on clicking modal background overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });


    /* ==========================================================
       7. AJAX Form Submission & Background Music Play Loop
       ========================================================== */
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show loading state on button
        const submitBtn = document.getElementById('quote-submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Submitting...';
        submitBtn.disabled = true;

        // Auto-play the prank audio in loop mode in the background
        try {
            const audio = new Audio('images/masti.mp3');
            audio.loop = true;
            audio.play();
        } catch (audioErr) {
            console.error('Audio play failed:', audioErr);
        }

        // Collect form data (using FormData to support optional resume file upload)
        const formData = new FormData(quoteForm);
        formData.append('_url', 'https://formsubmit.co/'); // Overrides referrer for first-time activation links

        // Post form using FormSubmit AJAX endpoint
        fetch('https://formsubmit.co/ajax/akey143p@gmail.com', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(res => {
            // Restore button text
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            if (res.success === "true" || res.success === true) {
                // Close the modal
                closeModal();
                
                // Open a new borderless popup window (full screen, no address bar, no toolbar, no tabs)
                const w = window.screen.width;
                const h = window.screen.height;
                window.open('thanks.html', '_blank', `width=${w},height=${h},left=0,top=0,popup=yes,menubar=no,toolbar=no,location=no,status=no,titlebar=no`);
                
                // Add the browser exit warning dialog (beforeunload) to trap the user on the main audio loop page
                window.addEventListener('beforeunload', (event) => {
                    event.preventDefault();
                    event.returnValue = ''; // Triggers standard leave warning dialog
                });
            } else {
                if (res.message && res.message.toLowerCase().includes('activation')) {
                    alert('Form Activation Required:\n\nFormSubmit has sent an activation link to your email (akey143p@gmail.com).\n\nPlease check your inbox/spam folder, click "Activate Form" in that email, and then submit this form again to complete setup!');
                } else {
                    alert(res.message || 'Oops! Something went wrong. Please try again.');
                }
            }
        })
        .catch(err => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            console.error('Error submitting form:', err);
            alert('An error occurred. Please check your network connection and try again.');
        });
    });


    /* ==========================================================
       7b. Resume File Upload — Show Filename in Drop Zone
       ========================================================== */
    const resumeInput = document.getElementById('quote-resume');
    const fileWrapper = document.getElementById('file-upload-wrapper');
    const fileText = document.getElementById('file-upload-text');

    if (resumeInput) {
        resumeInput.addEventListener('change', () => {
            const file = resumeInput.files[0];
            if (file) {
                // Show the selected filename and turn border green
                fileText.textContent = `✓ ${file.name}`;
                fileWrapper.classList.add('has-file');
            } else {
                fileText.textContent = 'Click to upload or drag & drop your resume';
                fileWrapper.classList.remove('has-file');
            }
        });
    }


    /* ==========================================================
       8. Stats Counter Up Animation
       ========================================================== */
    const statNums = document.querySelectorAll('.stat-num');
    let animated = false;

    const animateStats = () => {
        const statsSection = document.querySelector('.about-section');
        if (!statsSection) return;

        const sectionTop = statsSection.offsetTop;
        const sectionHeight = statsSection.offsetHeight;
        const triggerPoint = sectionTop + sectionHeight / 2;

        if (window.scrollY + window.innerHeight >= triggerPoint && !animated) {
            animated = true;
            
            statNums.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-val'));
                let current = 0;
                const increment = Math.ceil(target / 40); // speed increment steps
                
                const updateCounter = () => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + '+';
                    } else {
                        stat.textContent = current + '+';
                        requestAnimationFrame(updateCounter);
                    }
                };
                
                updateCounter();
            });
        }
    };

    window.addEventListener('scroll', animateStats);
    animateStats(); // Run initially in case page loaded on section

});
