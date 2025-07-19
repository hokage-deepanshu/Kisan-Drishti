 // --- Root CSS Variables for RGB values (used in rgba) ---
    const root = document.documentElement;
    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    }
    root.style.setProperty('--primary-green-rgb', hexToRgb(getComputedStyle(root).getPropertyValue('--primary-green').trim()));
    root.style.setProperty('--darker-green-rgb', hexToRgb(getComputedStyle(root).getPropertyValue('--darker-green').trim()));
    root.style.setProperty('--accent-brown-rgb', hexToRgb(getComputedStyle(root).getPropertyValue('--accent-brown').trim()));
    root.style.setProperty('--cta-blue-start-rgb', hexToRgb(getComputedStyle(root).getPropertyValue('--cta-blue-start').trim()));


// --- NEW Loading Screen Logic ---
const kisanDrishtiLoadingContainer = document.getElementById('kisanDrishtiLoadingContainer');
const loadingDrone = document.getElementById('loadingDrone'); 

if (kisanDrishtiLoadingContainer && loadingDrone) {
    setTimeout(() => {
        loadingDrone.classList.add('move-up');
    }, 300); 

    const totalLoadingAnimationTime = 2500; 
    const fadeOutTransitionTime = 500;    

    setTimeout(() => {
        kisanDrishtiLoadingContainer.classList.add('fade-out');
        document.body.classList.add('loaded'); 

        setTimeout(() => {
            kisanDrishtiLoadingContainer.style.display = 'none';
        }, fadeOutTransitionTime);
    }, totalLoadingAnimationTime);
} else {
    document.body.classList.add('loaded');
    if (kisanDrishtiLoadingContainer) kisanDrishtiLoadingContainer.style.display = 'none';
}
// --- END NEW Loading Screen Logic ---

    // --- Enhanced Hero Section Controller ---
    class HeroController {
        constructor() {
            this.hero = document.querySelector('.hero');
            this.heroContent = document.querySelector('.hero .hero-content');
            this.video = document.querySelector('.hero-video');
            this.playPauseBtn = document.getElementById('playPauseBtn');
            this.muteBtn = document.getElementById('muteBtn');
            this.particlesContainer = document.getElementById('particles-js-hero');
            this.navbarEl = document.querySelector('.navbar');
            this.scrollIndicator = document.querySelector('.scroll-indicator');
            this.init();
        }
        init() {
            this.createParticles();
            this.setupVideoControls();
            this.setupScrollEffects();
            this.setupNavbarEffectsHero();
        }
        createParticles() {
            if (!this.particlesContainer) return;
            const particleCount = (window.innerWidth < 768) ? 15 : 30; // Fewer on mobile
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.setProperty('--i', Math.random().toString());
                particle.style.animationDelay = `${Math.random() * 9}s`;
                particle.style.animationDuration = `${Math.random() * 5 + 7}s`;
                this.particlesContainer.appendChild(particle);
            }
        }
        setupVideoControls() {
            const mediaControls = document.querySelector('.media-controls');
            if (!this.video || !this.playPauseBtn || !this.muteBtn) {
                if (mediaControls) mediaControls.style.display = 'none';
                return;
            }
            this.playPauseBtn.addEventListener('click', () => {
                this.video.paused ? (this.video.play(), this.playPauseBtn.innerHTML = '⏸️') : (this.video.pause(), this.playPauseBtn.innerHTML = '▶️');
            });
            this.muteBtn.addEventListener('click', () => {
                this.video.muted = !this.video.muted;
                this.muteBtn.innerHTML = this.video.muted ? '🔇' : '🔊';
            });
            const videoObserver = new IntersectionObserver(entries => entries.forEach(entry => {
                if (!this.video) return;
                entry.isIntersecting ? this.video.play().catch(e => console.info("Autoplay for video was prevented.", e)) : this.video.pause();
            }), { threshold: 0.2 });
            videoObserver.observe(this.video);
        }
        setupScrollEffects() {
            if (!this.hero || !this.heroContent) return;
            const heroHeight = this.hero.offsetHeight;
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                if (scrolled < heroHeight) {
                    const opacity = Math.max(0, 1 - (scrolled / (heroHeight * 0.65)));
                    this.heroContent.style.opacity = opacity.toString();
                    this.heroContent.style.transform = `translateY(${scrolled * 0.35}px)`;
                } else {
                    this.heroContent.style.opacity = '0';
                }
            }, { passive: true });
            this.scrollIndicator?.addEventListener('click', () => {
                const featuresSection = document.querySelector('#features');
                if (featuresSection) {
                    const navbarHeight = this.navbarEl?.offsetHeight || 70;
                    window.scrollTo({ top: featuresSection.offsetTop - navbarHeight, behavior: 'smooth' });
                }
            });
        }
        setupNavbarEffectsHero() {
            if (!this.navbarEl) return;
            let lastScrollTop = 0;
            this.navbarEl.style.background = 'rgba(var(--primary-green-rgb), 0.8)';
            this.navbarEl.style.backdropFilter = 'blur(5px)';

            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset;
                const heroHeight = this.hero?.offsetHeight || window.innerHeight;

                if (scrollTop > 50 && scrollTop < heroHeight - 100) {
                    const scrollRatio = Math.min(1, (scrollTop - 50) / (heroHeight * 0.4));
                    const bgOpacity = 0.8 + scrollRatio * 0.15;
                    const blurValue = 5 + scrollRatio * 10;
                    this.navbarEl.style.background = `rgba(var(--primary-green-rgb), ${bgOpacity.toFixed(2)})`;
                    this.navbarEl.style.backdropFilter = `blur(${blurValue.toFixed(0)}px)`;
                } else if (scrollTop <= 50) {
                    this.navbarEl.style.background = 'rgba(var(--primary-green-rgb), 0.8)';
                    this.navbarEl.style.backdropFilter = 'blur(5px)';
                }

                if (scrollTop > lastScrollTop && scrollTop > 150) {
                    if (!this.navbarEl.classList.contains('active')) { // Don't hide if mobile menu is open
                        this.navbarEl.style.transform = 'translateY(-100%)';
                    }
                } else {
                    this.navbarEl.style.transform = 'translateY(0)';
                }
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            }, { passive: true });
        }
    }

    // --- Mouse Parallax for Hero Shapes ---
    class MouseParallax {
        constructor() {
            this.shapes = document.querySelectorAll('.hero .shape');
            this.init();
        }
        init() {
            if (window.innerWidth <= 768 || !this.shapes.length) return;
            document.addEventListener('mousemove', e => {
                const mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // Range -1 to 1
                const mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // Range -1 to 1
                this.shapes.forEach((shape, index) => {
                    const speed = (index % 3 + 1) * 0.15;
                    const x = mouseX * speed * 20;
                    const y = mouseY * speed * 20;
                    shape.style.setProperty('--mouse-x', `${x}px`);
                    shape.style.setProperty('--mouse-y', `${y}px`);
                });
            }, { passive: true });
        }
    }

    // --- General Intersection Observer for Scroll Animations ---
    const generalObserverOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
    const generalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                if (entry.target.classList.contains('counter')) {
                    animateSingleCounter(entry.target); // Animate counter when it becomes visible
                }
                if (!entry.target.classList.contains('counter')) { // Keep observing counters for re-animation if needed
                    observer.unobserve(entry.target);
                }
            }
        });
    }, generalObserverOptions);

    // --- Animate Counters ---
    function animateSingleCounter(counterElement) {
        const target = +counterElement.getAttribute('data-target');
        const duration = 1500; // Animation duration in ms
        const stepTime = Math.abs(Math.floor(duration / target));
        let current = 0;
        const timer = setInterval(() => {
            current += 1;
            counterElement.innerText = current;
            if (current === target) {
                clearInterval(timer);
            }
        }, stepTime < 1 ? 1: stepTime ); // Min step time 1ms
         counterElement.classList.add('counted'); // Mark as counted
    }
    
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => generalObserver.observe(counter)); // Observe counters


    // --- Navbar Logic (General color change & Mobile Burger) ---
    const mainNavbar = document.querySelector('.navbar');
    const contentSections = document.querySelectorAll('section:not(.hero)');
    const burgerMenu = document.getElementById('burgerMenu');
    const navButtonsContainer = document.getElementById('navButtons');

    const changeNavbarColor = () => {
        if (!mainNavbar) return;
        const scrollPos = window.pageYOffset + mainNavbar.offsetHeight;
        const hero = document.querySelector('.hero');
        const heroHeight = hero ? hero.offsetHeight : window.innerHeight;

        if (window.pageYOffset <= heroHeight - 100) return; // HeroController handles this range

        let inSpecificSection = false;
        contentSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                inSpecificSection = true;
                const newBg = section.classList.contains('youth-section') || section.classList.contains('contact') ? 'rgba(var(--primary-green-rgb), 0.97)' :
                              section.classList.contains('app-screenshots') ? 'rgba(44, 62, 80, 0.92)' :
                              'var(--primary-green)';
                mainNavbar.style.background = newBg;
                mainNavbar.style.backdropFilter = 'blur(12px)';
            }
        });
        if (!inSpecificSection && window.pageYOffset > heroHeight - 100) {
            mainNavbar.style.background = 'var(--primary-green)';
            mainNavbar.style.backdropFilter = 'blur(12px)';
        }
    };

    if (burgerMenu && navButtonsContainer) {
        burgerMenu.addEventListener('click', () => {
            mainNavbar.classList.toggle('active'); // Used for burger icon transform and nav-buttons visibility
        });
        // Close mobile menu when a link is clicked
        navButtonsContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNavbar.classList.contains('active')) {
                    mainNavbar.classList.remove('active');
                }
            });
        });
    }


    // --- Testimonial Carousel Logic ---
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    if (testimonialCarousel) {
        const track = testimonialCarousel.querySelector('.testimonial-track');
        const slides = Array.from(track.children);
        let currentSlideIndex = 0;
        let autoPlayInterval;
        let isDragging = false, startPos = 0, currentTranslate = 0, prevTranslate = 0;
        let cardsPerView = 3; // Default

        const updateSlidesPerView = () => {
            const carouselWidth = testimonialCarousel.offsetWidth;
            const card = slides[0]?.querySelector('.testimonial-card'); // Use optional chaining
            if (!card) return 1;
            const cardWidth = card.offsetWidth;
            const gap = parseFloat(getComputedStyle(slides[0]).gap) || 32; // Use actual gap or fallback

            let numCards = Math.max(1, Math.floor((carouselWidth + gap) / (cardWidth + gap)));
            if (window.innerWidth <= 768) numCards = 1;
            else if (window.innerWidth <= 992) numCards = Math.min(2, numCards);
            else numCards = Math.min(3, numCards);
            
            slides.forEach(slideEl => slideEl.style.gridTemplateColumns = `repeat(${numCards}, 1fr)`);
            return numCards;
        };

        const setSliderPosition = () => track.style.transform = `translateX(${currentTranslate}px)`;

        const goToSlide = (slideIndex) => {
            cardsPerView = updateSlidesPerView(); // Update cards per view dynamically
            currentSlideIndex = (slideIndex + slides.length) % slides.length;
            currentTranslate = -currentSlideIndex * testimonialCarousel.offsetWidth;
            prevTranslate = currentTranslate;
            setSliderPosition();
        };

        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayInterval = setInterval(() => goToSlide(currentSlideIndex + 1), 6000); // Slower autoplay
        };
        const stopAutoPlay = () => clearInterval(autoPlayInterval);

        const getPositionX = e => e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;

        const dragStart = e => {
            isDragging = true;
            startPos = getPositionX(e);
            currentTranslate = prevTranslate;
            track.style.transition = 'none';
            stopAutoPlay();
            testimonialCarousel.style.cursor = 'grabbing';
        };
        const dragMove = e => {
            if (isDragging) {
                if (e.type.includes('touch')) e.preventDefault(); // Only preventDefault for touch
                const currentPosition = getPositionX(e);
                currentTranslate = prevTranslate + currentPosition - startPos;
                setSliderPosition();
            }
        };
        const dragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            const movedBy = currentTranslate - prevTranslate;
            track.style.transition = 'transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
            testimonialCarousel.style.cursor = 'grab';

            if (movedBy < -80) goToSlide(currentSlideIndex + 1); // Threshold for swipe
            else if (movedBy > 80) goToSlide(currentSlideIndex - 1);
            else goToSlide(currentSlideIndex);
            
            // prevTranslate should be updated by goToSlide
            startAutoPlay();
        };

        track.addEventListener('mousedown', dragStart);
        track.addEventListener('touchstart', dragStart, { passive: true }); // passive true for start
        document.addEventListener('mouseup', dragEnd); // Listen on document for mouseup
        document.addEventListener('touchend', dragEnd);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('touchmove', dragMove, { passive: false }); // passive false for move with preventDefault

        window.addEventListener('resize', () => goToSlide(currentSlideIndex));
        if (slides.length > 0) { // Ensure slides exist before initializing
             goToSlide(0);
             startAutoPlay();
        }
    }

    // --- Interactive FAQ Toggles ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.setAttribute('aria-expanded', 'false');
            answer.setAttribute('aria-hidden', 'true');
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                // Close all others
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        otherAnswer.setAttribute('aria-hidden', 'true');
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.paddingTop = '0'; otherAnswer.style.paddingBottom = '0';
                    }
                });
                // Toggle current
                question.setAttribute('aria-expanded', String(!isExpanded));
                answer.setAttribute('aria-hidden', String(isExpanded));
                if (!isExpanded) {
                    answer.style.paddingTop = '1.8rem'; answer.style.paddingBottom = '1.8rem';
                    answer.style.maxHeight = `${answer.scrollHeight}px`;
                } else {
                    answer.style.maxHeight = '0';
                    answer.style.paddingTop = '0'; answer.style.paddingBottom = '0';
                }
            });
        }
    });

    // --- Smooth Scrolling for General Anchor Links ---
    document.querySelectorAll('a[href^="#"]:not(.hero .scroll-indicator a):not(.hero .cta-btn)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = mainNavbar?.offsetHeight || 70;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- App Screenshots Floating Elements Parallax ---
    const appScreenshotsSection = document.querySelector('.app-screenshots');
    if (appScreenshotsSection) {
        const appFloatingIcons = appScreenshotsSection.querySelectorAll('.app-screenshots .floating-icon'); //More specific
        appScreenshotsSection.addEventListener('mousemove', e => {
            if (window.innerWidth <= 768 || !appFloatingIcons.length) return;
            const rect = appScreenshotsSection.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
            const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
            appFloatingIcons.forEach((icon, index) => {
                const speed = (index % 2 + 1) * 0.25 + 0.05;
                const x = mouseX * speed * 15;
                const y = mouseY * speed * 15;
                icon.style.setProperty('--mouse-x-app', `${x}px`);
                icon.style.setProperty('--mouse-y-app', `${y}px`);
            });
        }, { passive: true });
    }
    
    // --- Update Current Year in Footer ---
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();


    // --- DOMContentLoaded - Main Initialization ---
    document.addEventListener('DOMContentLoaded', () => {
        new HeroController();
        if (window.innerWidth > 768) new MouseParallax();

        document.querySelectorAll('.animate-on-scroll').forEach(el => generalObserver.observe(el));
        
        // Staggered animation delays (can be handled by CSS if preferred)
        document.querySelectorAll('.feature-card').forEach((card, i) => card.style.transitionDelay = `${i * 0.08}s`);
        document.querySelectorAll('.step').forEach((step, i) => step.style.transitionDelay = `${i * 0.06}s`);

        let ticking = false;
        const handleScrollEvents = () => {
            changeNavbarColor();
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScrollEvents);
                ticking = true;
            }
        }, { passive: true });
        
        changeNavbarColor(); // Initial call for navbar color

        // Preload hero background image (if it's a CSS background)
        const heroImageDiv = document.querySelector('.hero-image');
        if (heroImageDiv && heroImageDiv.style.backgroundImage) {
            const heroImageUrlMatch = heroImageDiv.style.backgroundImage.match(/url\("?(.+?)"?\)/);
            if (heroImageUrlMatch && heroImageUrlMatch[1]) {
                const imgPreload = new Image();
                imgPreload.src = heroImageUrlMatch[1];
            }
        }
    }); // End of main DOMContentLoaded