document.addEventListener('DOMContentLoaded', () => {
    // --- Body State Initialization ---
    // Longer background fade so the sky cross-dissolves with the sun/moon travel
    document.body.style.transition = 'background-color 1.2s ease, color 0.6s ease';
    document.body.classList.add('loading');

    // --- DOM Elements ---
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');
    const themeToggle = document.getElementById('theme-toggle');
    const hero = document.querySelector('#home');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    const typedTextTarget = document.getElementById('typed-text') || document.querySelector('.hero-subtitle');
    const skillsSection = document.querySelector('#skills');
    const allSections = document.querySelectorAll('section:not(#home)');
    const certificateImage = document.querySelector('.certificate-image img');

    // Atmospheric scene layers
    const treeLineNear = document.querySelector('.tree-line-near');
    const treeLineFar = document.querySelector('.tree-line-far');
    const groundMist = document.querySelector('.ground-mist');
    const skyBackground = document.querySelector('.sky-background');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Helper Functions ---
    const closeMobileMenu = () => {
        if (navLinks && hamburger) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            body.style.overflow = '';
        }
    };

    // Throttle utility for scroll events
    const throttle = (fn, wait) => {
        let lastTime = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastTime >= wait) {
                lastTime = now;
                fn(...args);
            }
        };
    };

    // --- Navigation & Mobile Menu ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            hamburger.classList.toggle('active', isActive);
            body.style.overflow = isActive ? 'hidden' : '';
        });

        navItems.forEach(item => {
            item.addEventListener('click', closeMobileMenu);
        });
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll background toggle
    const handleScroll = () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    };
    window.addEventListener('scroll', throttle(handleScroll, 100));

    // --- Scene Visibility: treeline lives on the hero only ------------------
    // Night mode shows the silhouettes while you're at the top of the page;
    // as soon as you scroll into the content they fade away so nothing is
    // obscured. Day mode never shows trees at all — instead a soft greenery
    // band eases in once you approach the bottom of the page.
    const handleSceneVisibility = () => {
        const offset = window.scrollY;
        const viewportH = window.innerHeight;
        const docH = document.documentElement.scrollHeight;

        // Still on the hero? (fades out over the first ~45% of the viewport)
        body.classList.toggle('at-hero', offset < viewportH * 0.45);

        // Within roughly one and a half screens of the bottom
        const nearBottom = (offset + viewportH) >= (docH - viewportH * 0.6);
        body.classList.toggle('near-bottom', nearBottom);
    };

    window.addEventListener('scroll', throttle(handleSceneVisibility, 100), { passive: true });
    window.addEventListener('resize', throttle(handleSceneVisibility, 200));
    handleSceneVisibility();

    // --- Atmospheric Parallax (depth between the two treelines) ---
    const handleSceneParallax = () => {
        if (prefersReducedMotion) return;
        if (!body.classList.contains('at-hero')) return;

        const offset = window.scrollY;
        const nearShift = Math.min(offset * 0.035, 26);
        const farShift = Math.min(offset * 0.018, 14);

        if (treeLineNear) {
            treeLineNear.style.transform = `translateY(${nearShift}px)`;
        }
        if (treeLineFar) {
            treeLineFar.style.transform = `translateY(calc(-11% + ${farShift}px)) scale(1.02)`;
        }
        if (groundMist) {
            groundMist.style.opacity = String(Math.max(0.35, 1 - offset / 1400));
        }
        if (skyBackground) {
            skyBackground.style.transform = `translateY(${Math.min(offset * 0.012, 18)}px)`;
        }
    };

    window.addEventListener('scroll', throttle(handleSceneParallax, 16), { passive: true });
    handleSceneParallax();

    // --- Particle Background Loader ---
    // Independent, UNLINKED dots — no connecting lines, whiteish glow at night
    async function loadParticles(isDark) {
        if (typeof tsParticles === 'undefined') return;

        await tsParticles.load("bg-canvas", {
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            particles: {
                color: { value: isDark ? "#ffffff" : "#7dd3fc" },
                links: {
                    enable: false
                },
                move: {
                    enable: !prefersReducedMotion,
                    speed: isDark ? 0.5 : 0.7,
                    direction: "top",
                    straight: false,
                    random: true,
                    outModes: { default: "out" }
                },
                number: {
                    density: { enable: true, area: 900 },
                    value: isDark ? 55 : 38
                },
                opacity: {
                    value: { min: 0.15, max: isDark ? 0.85 : 0.45 },
                    animation: {
                        enable: true,
                        speed: 0.6,
                        sync: false,
                        startValue: "random"
                    }
                },
                shadow: {
                    enable: isDark,
                    color: "#ffffff",
                    blur: 8
                },
                shape: { type: "circle" },
                size: {
                    value: { min: 0.6, max: isDark ? 2.4 : 2 }
                }
            },
            detectRetina: true
        });
    }

    // --- Theme Switcher ---
    const applyTheme = (isDark, savePreference = false) => {
        body.classList.toggle('dark-mode', isDark);
        body.classList.toggle('light-mode', !isDark);

        const themeMeta = document.querySelector('meta[name="theme-color"]');
        if (themeMeta) {
            themeMeta.setAttribute('content', isDark ? '#040810' : '#dff0fd');
        }

        if (themeToggle) {
            themeToggle.checked = isDark;
        }

        if (savePreference) {
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }

        loadParticles(isDark);
    };

    // Initial Theme Detection
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialIsDark = savedTheme ? savedTheme === 'dark' : systemPrefersDark;

    applyTheme(initialIsDark);

    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            applyTheme(this.checked, true);
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches);
        }
    });

    // --- Hero Section Setup ---
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(30px)';
        hero.style.transition = 'all 0.8s ease 0.2s';
    }

    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateX(-30px)';
        heroContent.style.transition = 'all 0.8s ease 0.3s';
    }

    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(30px)';
        heroImage.style.transition = 'all 0.8s ease 0.3s';
    }

    // --- Typing Effect ---
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

    // --- Scroll Animations (Intersection Observers) ---
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const target = entry.target;
            target.classList.remove('section-hidden');
            target.classList.add('section-visible');

            // Sub-element stagger animations
            const aboutImage = target.querySelector('.about-image');
            const aboutText = target.querySelector('.about-text');
            const skillCategories = target.querySelectorAll('.skill-category');
            const skillItems = target.querySelectorAll('.skill-item');
            const projectCards = target.querySelectorAll('.project-card');
            const contactInfo = target.querySelector('.contact-info');
            const contactForm = target.querySelector('.contact-form');

            const animateElement = (el, transformInitial) => {
                if (!el) return;
                el.style.opacity = '0';
                el.style.transform = transformInitial;
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translate(0, 0) scale(1)';
                }, 100);
            };

            animateElement(aboutImage, 'translateX(-30px)');
            animateElement(aboutText, 'translateX(30px)');
            animateElement(contactInfo, 'translateX(-30px)');
            animateElement(contactForm, 'translateX(30px)');

            skillCategories.forEach((category, index) => {
                category.style.opacity = '0';
                category.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    category.style.opacity = '1';
                    category.style.transform = 'translateY(0)';
                }, 150 * index);
            });

            // Skill chips fade in one after another
            skillItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(18px)';
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 60 * index);
            });

            projectCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 150 * index);
            });

            observer.unobserve(target);
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

    // --- Certificate Modal ---
    if (certificateImage) {
        const modal = document.createElement('div');
        modal.className = 'certificate-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="" alt="Certificate" class="modal-image">
            </div>
        `;
        body.appendChild(modal);

        const modalImage = modal.querySelector('.modal-image');
        const closeModalBtn = modal.querySelector('.close-modal');

        const closeModal = () => {
            modal.classList.remove('active');
            body.style.overflow = '';
        };

        certificateImage.addEventListener('click', function() {
            modalImage.src = this.src;
            modal.classList.add('active');
            body.style.overflow = 'hidden';
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // --- Window Load Trigger ---
    window.addEventListener('load', () => {
        body.classList.remove('loading');
        body.classList.add('loaded');

        if (hero) {
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }

        setTimeout(() => {
            if (heroContent) {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateX(0)';
            }
            if (heroImage) {
                heroImage.style.opacity = '1';
                heroImage.style.transform = 'translateX(0)';
            }
        }, 300);

        setTimeout(typeWriter, 1000);
    });

    // Fallback loading screen removal
    setTimeout(() => {
        body.classList.remove('loading');
    }, 1000);
});