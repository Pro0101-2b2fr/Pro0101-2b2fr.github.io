
// Variables globales
let particlesArray = [];
let animationId;

// Chargement initial
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation
    initializeApp();
    createParticles();
    animateParticles();
    setupScrollAnimations();
    setupNavigation();
    setupSkillBars();
    setupCounters();
    
    // Masquer le loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 3000);
});

// Initialisation de l'application
function initializeApp() {
    console.log('🚀 Pro Client Better - Site initialisé');
    
    // Configuration de performance
    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
            console.log('💡 Optimisations de performance appliquées');
        });
    }
}

// Système de particules
function createParticles() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const particlesContainer = document.getElementById('particles-background');
    
    if (!particlesContainer) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    
    particlesContainer.appendChild(canvas);
    
    // Créer les particules
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
    
    for (let i = 0; i < particleCount; i++) {
        particlesArray.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? '#00f5ff' : '#ff6b35'
        });
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesArray.forEach(particle => {
            // Mise à jour de la position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Rebond sur les bords
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            
            // Dessiner la particule
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
            
            // Effet de lueur
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        
        // Connexions entre particules proches
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i + 1; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        
        animationId = requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Redimensionnement
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Navigation
function setupNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Effet de scroll sur la navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Menu mobile
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Fermer le menu au clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animations au scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animation spéciale pour les cartes
                if (entry.target.classList.contains('about-card') || 
                    entry.target.classList.contains('project-card') ||
                    entry.target.classList.contains('contact-card')) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            }
        });
    }, observerOptions);
    
    // Observer les éléments
    const elementsToAnimate = document.querySelectorAll('.about-card, .project-card, .skill-category, .contact-card');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Animation des barres de compétences
function setupSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = targetWidth + '%';
                }, 200);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Animation des compteurs
function setupCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Effets de particules sur hover des boutons
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', function(e) {
        createButtonParticles(e.target);
    });
});

function createButtonParticles(button) {
    const rect = button.getBoundingClientRect();
    const particles = [];
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#00f5ff';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        particle.style.left = (rect.left + rect.width / 2) + 'px';
        particle.style.top = (rect.top + rect.height / 2) + 'px';
        
        document.body.appendChild(particle);
        particles.push(particle);
        
        // Animation
        const angle = (360 / 6) * i;
        const velocity = 2;
        const dx = Math.cos(angle * Math.PI / 180) * velocity;
        const dy = Math.sin(angle * Math.PI / 180) * velocity;
        
        let x = rect.left + rect.width / 2;
        let y = rect.top + rect.height / 2;
        let opacity = 1;
        
        function animateParticle() {
            x += dx;
            y += dy;
            opacity -= 0.02;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        }
        
        animateParticle();
    }
}

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('📊 Temps de chargement:', perfData.loadEventEnd - perfData.loadEventStart + 'ms');
        });
    }
}

// Easter egg - Konami Code
let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Mode Matrix
    document.body.style.filter = 'hue-rotate(120deg)';
    
    // Message secret
    const message = document.createElement('div');
    message.innerHTML = '🎮 Pro Client Better - Mode développeur activé! 🚀';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.background = 'rgba(0, 0, 0, 0.9)';
    message.style.color = '#00f5ff';
    message.style.padding = '2rem';
    message.style.borderRadius = '10px';
    message.style.border = '2px solid #00f5ff';
    message.style.zIndex = '10000';
    message.style.fontSize = '1.2rem';
    message.style.textAlign = 'center';
    message.style.animation = 'glow 1s ease-in-out infinite alternate';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
        document.body.style.filter = 'none';
    }, 3000);
}

// Nettoyage à la fermeture
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

// Initialisation des performances
monitorPerformance();
