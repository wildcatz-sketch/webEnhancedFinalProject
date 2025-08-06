// Main JavaScript for Naruto Fanpage
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoader();
    initNavigation();
    initScrollEffects();
    initCounters();
    initParallax();
    initHoverEffects();
    
    console.log('Naruto Fanpage loaded successfully!');
});

// Page Loader
function initLoader() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Simulate loading time
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        document.body.classList.add('loaded');
        
        // Remove loader from DOM after animation
        setTimeout(() => {
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
        }, 500);
    }, 2000);
}

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// Scroll-triggered animations
function initScrollEffects() {
    const scrollElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('revealed');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('revealed');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                const delay = el.dataset.delay || 0;
                setTimeout(() => {
                    displayScrollElement(el);
                }, delay);
            }
        });
    };
    
    window.addEventListener('scroll', handleScrollAnimation);
    
    // Initial check
    handleScrollAnimation();
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Parallax effects
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Enhanced hover effects
function initHoverEffects() {
    // Card tilt effect
    const tiltCards = document.querySelectorAll('.card-tilt, .featured-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            card.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
    
    // Button ripple effect
    const rippleButtons = document.querySelectorAll('.btn');
    
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
}

// Initialize lazy loading
initLazyLoading();

// Performance optimization
window.addEventListener('load', () => {
    // Remove unused CSS after page load
    const unusedStylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
    unusedStylesheets.forEach(stylesheet => {
        stylesheet.media = 'print';
        stylesheet.onload = function() {
            this.media = 'all';
        };
    });
});

// Easter eggs and special effects
function initEasterEggs() {
    let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateNinjaMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateNinjaMode() {
    const body = document.body;
    body.classList.add('ninja-mode');
    
    // Create falling leaves effect
    for (let i = 0; i < 20; i++) {
        createFallingLeaf();
    }
    
    // Show special message
    showNinjaMessage();
}

function createFallingLeaf() {
    const leaf = document.createElement('div');
    leaf.innerHTML = '🍃';
    leaf.style.position = 'fixed';
    leaf.style.top = '-50px';
    leaf.style.left = Math.random() * window.innerWidth + 'px';
    leaf.style.fontSize = '20px';
    leaf.style.zIndex = '9999';
    leaf.style.pointerEvents = 'none';
    leaf.classList.add('leaf-fall');
    
    document.body.appendChild(leaf);
    
    setTimeout(() => {
        leaf.remove();
    }, 3000);
}

function showNinjaMessage() {
    const message = document.createElement('div');
    message.innerHTML = '🥷 Ninja Mode Activated! The power of the Nine-Tails flows through you! 🦊';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.background = 'linear-gradient(135deg, #ff6b35, #f59e0b)';
    message.style.color = 'white';
    message.style.padding = '2rem';
    message.style.borderRadius = '10px';
    message.style.textAlign = 'center';
    message.style.zIndex = '10000';
    message.style.animation = 'scaleIn 0.5s ease-out';
    message.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => message.remove(), 500);
    }, 3000);
}

// Initialize easter eggs
initEasterEggs();

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
        }
    }
    
    .ninja-mode {
        position: relative;
        overflow-x: hidden;
    }
`;
document.head.appendChild(style);
