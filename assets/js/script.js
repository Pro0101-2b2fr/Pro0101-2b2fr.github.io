
// Animation et interactions modernes
document.addEventListener('DOMContentLoaded', function() {
  // Navigation mobile
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile menu
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close menu when clicking on links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  // Smooth scrolling
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

  // Active navigation highlighting
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Navbar scroll effect
  function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 10, 15, 0.98)';
      navbar.style.borderBottom = '1px solid rgba(59, 130, 246, 0.3)';
    } else {
      navbar.style.background = 'rgba(10, 10, 15, 0.95)';
      navbar.style.borderBottom = '1px solid var(--border-color)';
    }
  }

  // Throttled scroll event
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveNav();
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll);

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Special handling for skill bars
        if (entry.target.classList.contains('skill-progress')) {
          const width = entry.target.dataset.width;
          entry.target.style.setProperty('--width', width);
        }
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.project-card, .skill-category, .about-text, .contact-info, .tech-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // Observe skill bars
  document.querySelectorAll('.skill-progress').forEach(el => {
    observer.observe(el);
  });

  // Typing animation for hero code
  function typeCode() {
    const codeElement = document.querySelector('.typing-animation .code-text');
    if (codeElement) {
      const text = codeElement.textContent;
      codeElement.textContent = '';
      codeElement.style.borderRight = '2px solid var(--primary-color)';
      
      let i = 0;
      function type() {
        if (i < text.length) {
          codeElement.textContent += text.charAt(i);
          i++;
          setTimeout(type, 50);
        } else {
          // Blinking cursor effect
          setInterval(() => {
            codeElement.style.borderRight = codeElement.style.borderRight === 'none' 
              ? '2px solid var(--primary-color)' 
              : 'none';
          }, 500);
        }
      }
      
      setTimeout(type, 1000);
    }
  }

  // Start typing animation after page load
  setTimeout(typeCode, 2000);

  // Floating shapes animation enhancement
  function enhanceFloatingShapes() {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
      const speed = 20 + (index * 5);
      const delay = -(index * 4);
      shape.style.animationDuration = `${speed}s`;
      shape.style.animationDelay = `${delay}s`;
      
      // Add mouse interaction
      shape.addEventListener('mouseenter', () => {
        shape.style.animationPlayState = 'paused';
        shape.style.transform = 'scale(1.2)';
      });
      
      shape.addEventListener('mouseleave', () => {
        shape.style.animationPlayState = 'running';
        shape.style.transform = 'scale(1)';
      });
    });
  }

  enhanceFloatingShapes();

  // Particle effect for buttons
  function createParticleEffect(button) {
    button.addEventListener('click', function(e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'var(--primary-color)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        button.style.position = 'relative';
        button.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 6;
        const velocity = 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let particleX = x;
        let particleY = y;
        let opacity = 1;
        
        function animateParticle() {
          particleX += vx * 0.02;
          particleY += vy * 0.02;
          opacity -= 0.02;
          
          particle.style.left = particleX + 'px';
          particle.style.top = particleY + 'px';
          particle.style.opacity = opacity;
          
          if (opacity > 0) {
            requestAnimationFrame(animateParticle);
          } else {
            particle.remove();
          }
        }
        
        requestAnimationFrame(animateParticle);
      }
    });
  }

  // Apply particle effect to buttons
  document.querySelectorAll('.btn-primary').forEach(createParticleEffect);

  // Parallax effect for hero section
  function parallaxEffect() {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (hero) {
      hero.style.transform = `translateY(${rate}px)`;
    }
  }

  window.addEventListener('scroll', parallaxEffect);

  // Dark mode toggle (future enhancement)
  function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
      });
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    }
  }

  initThemeToggle();

  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          console.log('Page load time:', Math.round(perfData.loadEventEnd - perfData.loadEventStart), 'ms');
        }
      }, 0);
    });
  }

  // Preload critical images
  function preloadImages() {
    const imageUrls = [
      // Add any critical image URLs here
    ];
    
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  preloadImages();

  // Error handling for external resources
  window.addEventListener('error', (e) => {
    if (e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT') {
      console.warn('Failed to load resource:', e.target.src || e.target.href);
    }
  });

  // Accessibility improvements
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });

  // Reduced motion support
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    document.documentElement.style.setProperty('--transition-duration', '0.01ms');
  }

  // Initialize everything
  console.log('🚀 Portfolio initialized successfully!');
});

// Utility functions
const utils = {
  debounce: function(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

  throttle: function(func, limit) {
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
  },

  randomBetween: function(min, max) {
    return Math.random() * (max - min) + min;
  }
};

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { utils };
}
