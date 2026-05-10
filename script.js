document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader and Initial Animations
    const preloader = document.querySelector('.preloader');
    const loadingBar = document.querySelector('.loading-bar');
    const loadingPercentage = document.querySelector('.loading-percentage');
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                preloader.classList.add('loaded');
                document.body.classList.add('loaded');
            }, 500);
        }
        loadingBar.style.width = `${progress}%`;
        loadingPercentage.textContent = `${progress}%`;
    }, 80);

    // 2. Navigation Menu
    const navBtn = document.querySelector('.nav-menu-btn');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    navBtn.addEventListener('click', () => {
        navBtn.classList.toggle('active');
        navOverlay.classList.toggle('active');
        
        if (navOverlay.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navBtn.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';

            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                setTimeout(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }, 600); // Wait for menu close animation
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // 3. Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-up');
    const revealImages = document.querySelectorAll('.reveal-img');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    entry.target.style.transitionDelay = `${delay}s`;
                }
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => scrollObserver.observe(el));
    revealImages.forEach(el => scrollObserver.observe(el));

    // 4. Parallax Effect (Optimized with Intersection Observer for Performance)
    const parallaxImages = document.querySelectorAll('.parallax-img');
    let ticking = false;
    let windowHeight = window.innerHeight;

    window.addEventListener('resize', () => {
        windowHeight = window.innerHeight;
    }, { passive: true });

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                parallaxImages.forEach(img => {
                    const speed = img.getAttribute('data-speed') || 0.2;
                    const rect = img.getBoundingClientRect();
                    const center = windowHeight / 2;
                    
                    // Only animate if in or very close to viewport
                    if (rect.top < windowHeight + 200 && rect.bottom > -200) {
                        const offset = (rect.top - center) * speed;
                        img.style.transform = `translateY(calc(-10% + ${offset}px))`;
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // 5. Magnetic Elements (Premium interaction for Desktop)
    const magneticElements = document.querySelectorAll('.magnetic-element');
    
    // Only apply on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Increase the movement amount for premium feel
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // 6. Year Update
    document.getElementById('year').textContent = new Date().getFullYear();

    // 7. WhatsApp Form Booking Integration
    const waForm = document.getElementById('whatsappForm');
    if (waForm) {
        waForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('waName').value.trim();
            const phone = document.getElementById('waPhone').value.trim();
            const service = document.getElementById('waService').value;
            const message = document.getElementById('waMessage').value.trim();
            
            // Format the message for WhatsApp
            const text = `*New Booking Inquiry* %0a%0a*Name:* ${name}%0a*Phone:* ${phone}%0a*Service:* ${service}%0a*Details:* ${message}`;
            
            // Your WhatsApp Number (Include country code without '+')
            const whatsappNumber = "919999999999"; 
            
            // Create WhatsApp URL
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${text}`;
            
            // Animate button feedback before opening tab
            const btn = waForm.querySelector('.submit-btn span');
            const originalText = btn.textContent;
            btn.textContent = 'Redirecting...';
            
            setTimeout(() => {
                // Open WhatsApp in new tab
                window.open(whatsappURL, '_blank');
                
                // Reset form
                waForm.reset();
                btn.textContent = originalText;
            }, 800);
        });
    }
});
