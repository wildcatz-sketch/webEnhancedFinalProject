// Advanced Animation System for Naruto Fanpage
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animations = new Map();
        this.init();
    }
    
    init() {
        this.setupIntersectionObservers();
        this.setupScrollAnimations();
        this.setupMouseAnimations();
        this.setupPageTransitions();
    }
    
    // Intersection Observer for scroll-triggered animations
    setupIntersectionObservers() {
        const observerOptions = {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '-10% 0px -10% 0px'
        };
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerScrollAnimation(entry.target, entry.intersectionRatio);
                }
            });
        }, observerOptions);
        
        this.observers.set('scroll', scrollObserver);
        
        // Observe all elements with scroll reveal classes
        document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale')
            .forEach(el => scrollObserver.observe(el));
    }
    
    // Enhanced scroll animations
    setupScrollAnimations() {
        let ticking = false;
        
        const updateScrollAnimations = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Parallax backgrounds
            this.updateParallaxElements(scrollY);
            
            // Header animations
            this.updateHeaderAnimations(scrollY);
            
            // Progress bars and counters
            this.updateProgressAnimations(scrollY, windowHeight);
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Mouse movement animations
    setupMouseAnimations() {
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
            
            this.updateMouseFollowElements(mouseX, mouseY);
        });
        
        // Enhanced hover effects for cards
        document.querySelectorAll('.featured-card, .character-card, .gallery-item')
            .forEach(card => this.setupCardHoverEffect(card));
    }
    
    // Page transition animations
    setupPageTransitions() {
        // Handle page load
        window.addEventListener('load', () => {
            this.playPageLoadAnimation();
        });
        
        // Handle page navigation (for SPA-like behavior)
        document.querySelectorAll('a[href$=".html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.playPageTransition(link.href);
            });
        });
    }
    
    // Trigger scroll-based animations
    triggerScrollAnimation(element, ratio) {
        const delay = parseInt(element.dataset.delay) || 0;
        const animationType = this.getAnimationType(element);
        
        setTimeout(() => {
            element.classList.add('revealed');
            this.playCustomAnimation(element, animationType, ratio);
        }, delay);
    }
    
    // Custom animation player
    playCustomAnimation(element, type, intensity = 1) {
        switch(type) {
            case 'bounce':
                this.bounceAnimation(element, intensity);
                break;
            case 'rotate':
                this.rotateAnimation(element, intensity);
                break;
            case 'glow':
                this.glowAnimation(element, intensity);
                break;
            case 'typewriter':
                this.typewriterAnimation(element);
                break;
            default:
                this.defaultRevealAnimation(element, intensity);
        }
    }
    
    // Animation implementations
    bounceAnimation(element, intensity) {
        element.style.animation = `bounce ${0.6 * intensity}s ease-in-out`;
        element.addEventListener('animationend', () => {
            element.style.animation = '';
        }, { once: true });
    }
    
    rotateAnimation(element, intensity) {
        element.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        element.style.transform = `rotate(${360 * intensity}deg) scale(${0.8 + 0.2 * intensity})`;
        
        setTimeout(() => {
            element.style.transform = 'rotate(0deg) scale(1)';
        }, 100);
    }
    
    glowAnimation(element, intensity) {
        element.style.filter = `drop-shadow(0 0 ${10 * intensity}px var(--primary-color))`;
        element.style.transition = 'filter 0.8s ease';
        
        setTimeout(() => {
            element.style.filter = 'none';
        }, 2000);
    }
    
    typewriterAnimation(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';
        element.style.width = '0';
        element.style.animation = 'typewriter 2s steps(40, end) forwards, blinkCursor 0.75s step-end infinite';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            element.textContent = text.slice(0, i);
            i++;
            if (i > text.length) {
                clearInterval(typeInterval);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, 50);
    }
    
    defaultRevealAnimation(element, intensity) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1)';
        element.style.filter = `blur(${5 * (1 - intensity)}px)`;
        
        setTimeout(() => {
            element.style.filter = 'none';
        }, 500);
    }
    
    // Parallax updates
    updateParallaxElements(scrollY) {
        document.querySelectorAll('.parallax-slow').forEach(el => {
            el.style.transform = `translateY(${scrollY * 0.3}px)`;
        });
        
        document.querySelectorAll('.parallax-fast').forEach(el => {
            el.style.transform = `translateY(${scrollY * -0.5}px)`;
        });
        
        // Hero background parallax
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
    }
    
    // Header animations based on scroll
    updateHeaderAnimations(scrollY) {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        if (scrollY > 100) {
            navbar.classList.add('scrolled', 'compact');
        } else {
            navbar.classList.remove('scrolled', 'compact');
        }
        
        // Auto-hide on scroll down
        if (scrollY > this.lastScrollY && scrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        this.lastScrollY = scrollY;
    }
    
    // Progress and counter animations
    updateProgressAnimations(scrollY, windowHeight) {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                const progress = bar.dataset.progress || 0;
                bar.style.width = `${progress}%`;
            }
        });
        
        // Update skill meters or other animated elements
        this.updateSkillMeters(scrollY, windowHeight);
    }
    
    // Mouse follow effects
    updateMouseFollowElements(mouseX, mouseY) {
        document.querySelectorAll('.mouse-follow').forEach(el => {
            const speed = el.dataset.speed || 0.1;
            const x = (mouseX - 0.5) * 50 * speed;
            const y = (mouseY - 0.5) * 50 * speed;
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        // Cursor effects
        this.updateCustomCursor(mouseX, mouseY);
    }
    
    // Enhanced card hover effects
    setupCardHoverEffect(card) {
        let isHovering = false;
        
        card.addEventListener('mouseenter', () => {
            isHovering = true;
            this.startCardHoverAnimation(card);
        });
        
        card.addEventListener('mouseleave', () => {
            isHovering = false;
            this.endCardHoverAnimation(card);
        });
        
        card.addEventListener('mousemove', (e) => {
            if (isHovering) {
                this.updateCardTilt(card, e);
            }
        });
    }
    
    startCardHoverAnimation(card) {
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        
        // Add glow effect if it's a special card
        if (card.classList.contains('special-card')) {
            card.style.filter = 'drop-shadow(0 0 20px var(--primary-color))';
        }
    }
    
    endCardHoverAnimation(card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        card.style.filter = 'none';
    }
    
    updateCardTilt(card, event) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 8;
        const rotateY = (centerX - x) / 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    }
    
    // Page transition effects
    playPageLoadAnimation() {
        const elements = document.querySelectorAll('.animate-on-load');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('loaded');
            }, index * 100);
        });
    }
    
    playPageTransition(href) {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-spinner"></div>
                <p>Loading...</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            window.location.href = href;
        }, 800);
    }
    
    // Utility methods
    getAnimationType(element) {
        const classes = element.classList;
        if (classes.contains('animate-bounce')) return 'bounce';
        if (classes.contains('animate-rotate')) return 'rotate';
        if (classes.contains('animate-glow')) return 'glow';
        if (classes.contains('animate-typewriter')) return 'typewriter';
        return 'default';
    }
    
    updateSkillMeters(scrollY, windowHeight) {
        document.querySelectorAll('.skill-meter').forEach(meter => {
            const rect = meter.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                const level = meter.dataset.level || 0;
                const fill = meter.querySelector('.skill-fill');
                if (fill) {
                    fill.style.width = `${level}%`;
                    fill.style.transition = 'width 1.5s ease-in-out';
                }
            }
        });
    }
    
    updateCustomCursor(mouseX, mouseY) {
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) {
            cursor.style.left = `${mouseX * window.innerWidth}px`;
            cursor.style.top = `${mouseY * window.innerHeight}px`;
        }
    }
}

// Specialized animation classes
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.particles = [];
        this.options = {
            count: options.count || 50,
            color: options.color || '#4ade80',
            size: options.size || 2,
            speed: options.speed || 1,
            type: options.type || 'leaf'
        };
        this.init();
    }
    
    init() {
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        for (let i = 0; i < this.options.count; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${this.options.size}px;
            height: ${this.options.size}px;
            background: ${this.options.color};
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.7;
        `;
        
        particle.x = Math.random() * this.container.offsetWidth;
        particle.y = Math.random() * this.container.offsetHeight;
        particle.vx = (Math.random() - 0.5) * this.options.speed;
        particle.vy = (Math.random() - 0.5) * this.options.speed;
        
        this.container.appendChild(particle);
        return particle;
    }
    
    animate() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.container.offsetWidth;
            if (particle.x > this.container.offsetWidth) particle.x = 0;
            if (particle.y < 0) particle.y = this.container.offsetHeight;
            if (particle.y > this.container.offsetHeight) particle.y = 0;
            
            particle.style.left = `${particle.x}px`;
            particle.style.top = `${particle.y}px`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Text animation utilities
class TextAnimator {
    static splitText(element, type = 'chars') {
        const text = element.textContent;
        element.innerHTML = '';
        
        if (type === 'chars') {
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                span.style.animationDelay = `${index * 0.1}s`;
                element.appendChild(span);
            });
        } else if (type === 'words') {
            text.split(' ').forEach((word, index) => {
                const span = document.createElement('span');
                span.textContent = word;
                span.style.display = 'inline-block';
                span.style.marginRight = '0.3em';
                span.style.animationDelay = `${index * 0.2}s`;
                element.appendChild(span);
            });
        }
    }
    
    static animateText(element, animation = 'fadeInUp') {
        this.splitText(element);
        element.querySelectorAll('span').forEach(span => {
            span.classList.add(animation);
        });
    }
}

// Initialize the animation system
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
    
    // Initialize particle systems for special sections
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new ParticleSystem(heroSection, {
            count: 20,
            color: '#4ade80',
            size: 3,
            speed: 0.5,
            type: 'leaf'
        });
    }
    
    // Initialize text animations
    document.querySelectorAll('.animate-text').forEach(element => {
        TextAnimator.animateText(element, 'fadeInUp');
    });
});

// Add required CSS for transitions
const transitionStyles = `
    .page-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0f172a, #1e3a8a);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: slideInRight 0.8s ease-out;
    }
    
    .transition-content {
        text-align: center;
        color: white;
    }
    
    .transition-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255, 107, 53, 0.3);
        border-left: 3px solid #ff6b35;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    .particle {
        z-index: 1;
        animation: float 6s ease-in-out infinite;
    }
    
    .animate-on-load {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    .animate-on-load.loaded {
        opacity: 1;
        transform: translateY(0);
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = transitionStyles;
document.head.appendChild(styleSheet);
