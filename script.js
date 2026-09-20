document.addEventListener('DOMContentLoaded', function() {
    // Set initial body class for transitions
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    document.body.classList.add('loading');

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu when clicking a link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks && hamburger) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // --- Particle Background Configuration ---
    async function loadParticles(isDark) {
        if (typeof tsParticles === 'undefined') return;
        
        await tsParticles.load("bg-canvas", {
            background: {
                color: { value: "transparent" }
            },
            fpsLimit: 60,
            particles: {
                color: { value: isDark ? "#64ffda" : "#0066cc" },
                links: {
                    color: isDark ? "#64ffda" : "#0066cc",
                    distance: 150,
                    enable: true,
                    opacity: isDark ? 0.2 : 0.15,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.2,
                    direction: "none",
                    outModes: { default: "bounce" }
                },
                number: {
                    density: { enable: true, area: 800 },
                    value: 45
                },
                opacity: { value: isDark ? 0.3 : 0.4 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } }
            },
            detectRetina: true
        });
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved user preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply the initial theme
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    if (isDarkMode) {
        body.classList.add('dark-mode');
        if (themeToggle) themeToggle.checked = true;
    } else {
        body.classList.add('light-mode');
        if (themeToggle) themeToggle.checked = false;
    }
    loadParticles(isDarkMode);

    // Toggle theme when checkbox changes
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                loadParticles(true);
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                loadParticles(false);
            }
        });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                if (themeToggle) themeToggle.checked = true;
                loadParticles(true);
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                if (themeToggle) themeToggle.checked = false;
                loadParticles(false);
            }
        }
    });

    // Hero animation
    const hero = document.querySelector('#home');
    if (hero) {
        hero.style.opacity = 0;
        hero.style.transform = 'translateY(30px)';
        hero.style.transition = 'all 0.8s ease 0.2s';
    }

    // Hero content animations
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent) {
        heroContent.style.opacity = 0;
        heroContent.style.transform = 'translateX(-30px)';
        heroContent.style.transition = 'all 0.8s ease 0.3s';
    }
    
    if (heroImage) {
        heroImage.style.opacity = 0;
        heroImage.style.transform = 'translateX(30px)';
        heroImage.style.transition = 'all 0.8s ease 0.3s';
    }

    // Typing effect for hero subtitle
    const typedTextTarget = document.getElementById('typed-text') || document.querySelector('.hero-subtitle');
    const titles = [
        "Computer Science Student",
        "Web Developer", 
        "Creative Coder"
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeWriter() {
        if (!typedTextTarget) return;
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            typedTextTarget.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedTextTarget.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500;
        }

        setTimeout(typeWriter, typingSpeed);
    }

    // Start typing effect when page loads
    window.addEventListener('load', () => {
        setTimeout(typeWriter, 1000);
    });

    // Intersection Observer for skills section
    const skillsSection = document.querySelector('#skills');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    if (skillsSection) {
        observer.observe(skillsSection);
    }

    // Section animations
    const allSections = document.querySelectorAll('section:not(#home)');
    
    const revealSection = function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            entry.target.classList.remove('section-hidden');
            entry.target.classList.add('section-visible');
            
            const aboutImage = entry.target.querySelector('.about-image');
            const aboutText = entry.target.querySelector('.about-text');
            const skillCategories = entry.target.querySelectorAll('.skill-category');
            const projectCards = entry.target.querySelectorAll('.project-card');
            const contactInfo = entry.target.querySelector('.contact-info');
            const contactForm = entry.target.querySelector('.contact-form');
            
            if (aboutImage) {
                aboutImage.style.opacity = 0;
                aboutImage.style.transform = 'translateX(-30px)';
                setTimeout(() => {
                    aboutImage.style.opacity = 1;
                    aboutImage.style.transform = 'translateX(0)';
                }, 100);
            }
            
            if (aboutText) {
                aboutText.style.opacity = 0;
                aboutText.style.transform = 'translateX(30px)';
                setTimeout(() => {
                    aboutText.style.opacity = 1;
                    aboutText.style.transform = 'translateX(0)';
                }, 100);
            }
            
            if (skillCategories.length > 0) {
                skillCategories.forEach((category, index) => {
                    category.style.opacity = 0;
                    category.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        category.style.opacity = 1;
                        category.style.transform = 'translateY(0)';
                    }, 150 * index);
                });
            }
            
            if (projectCards.length > 0) {
                projectCards.forEach((card, index) => {
                    card.style.opacity = 0;
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = 1;
                        card.style.transform = 'scale(1)';
                    }, 150 * index);
                });
            }
            
            if (contactInfo) {
                contactInfo.style.opacity = 0;
                contactInfo.style.transform = 'translateX(-30px)';
                setTimeout(() => {
                    contactInfo.style.opacity = 1;
                    contactInfo.style.transform = 'translateX(0)';
                }, 100);
            }
            
            if (contactForm) {
                contactForm.style.opacity = 0;
                contactForm.style.transform = 'translateX(30px)';
                setTimeout(() => {
                    contactForm.style.opacity = 1;
                    contactForm.style.transform = 'translateX(0)';
                }, 100);
            }
            
            observer.unobserve(entry.target);
        });
    };
    
    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    allSections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });

    // Certificate Modal functionality
    const certificateImage = document.querySelector('.certificate-image img');
    if (certificateImage) {
        const modal = document.createElement('div');
        modal.className = 'certificate-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="" alt="Certificate" class="modal-image">
            </div>
        `;
        document.body.appendChild(modal);
        
        const modalImage = document.querySelector('.modal-image');
        const closeModal = document.querySelector('.close-modal');
        
        certificateImage.addEventListener('click', function() {
            modalImage.src = this.src;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Page load animations
    window.addEventListener('load', () => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        
        if (hero) {
            hero.style.opacity = 1;
            hero.style.transform = 'translateY(0)';
        }
        
        setTimeout(() => {
            if (heroContent) {
                heroContent.style.opacity = 1;
                heroContent.style.transform = 'translateX(0)';
            }
            
            if (heroImage) {
                heroImage.style.opacity = 1;
                heroImage.style.transform = 'translateX(0)';
            }
        }, 300);
    });

    // Loading screen removal fallback
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 1000);
});