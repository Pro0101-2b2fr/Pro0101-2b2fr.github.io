/**
 * Portfolio Website JavaScript
 * Author: Pro0101-2b2fr
 * Description: Interactive functionality and performance optimizations
 */

'use strict';

// ==========================================================================
// Utility Functions
// ==========================================================================

/**
 * Debounce function to limit the rate of function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {Function} Debounced function
 */
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 * @param {string} targetId - ID of target element
 * @param {number} offset - Offset from top
 */
function smoothScrollTo(targetId, offset = 80) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

// ==========================================================================
// Navigation Functionality
// ==========================================================================

class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navToggle = document.querySelector('.nav-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.isMenuOpen = false;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e));
    });

    // Scroll events
    window.addEventListener('scroll', throttle(() => this.handleScroll(), 16));

    // Close mobile menu on resize
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    }, 250));

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.navbar.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.isMenuOpen ? this.closeMobileMenu() : this.openMobileMenu();
  }

  openMobileMenu() {
    this.isMenuOpen = true;
    this.navMenu.classList.add('active');
    this.navToggle.classList.add('active');
    this.navToggle.setAttribute('aria-expanded', 'true');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus first menu item
    const firstLink = this.navMenu.querySelector('.nav-link');
    if (firstLink) firstLink.focus();
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    this.navToggle.setAttribute('aria-expanded', 'false');
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  handleNavClick(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      smoothScrollTo(targetId);
      
      // Close mobile menu if open
      if (this.isMenuOpen) {
        this.closeMobileMenu();
      }
      
      // Update active state
      this.updateActiveLink(e.target);
    }
  }

  updateActiveLink(activeLink) {
    this.navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
  }

  handleScroll() {
    const scrollY = window.scrollY;
    
    // Add/remove scrolled class for navbar styling
    if (scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }

    // Update active navigation based on scroll position
    this.updateActiveNavOnScroll();
  }

  updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  }
}

// ==========================================================================
// Scroll Animations
// ==========================================================================

class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('.project-card, .skill-item, .contact-btn');
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }

  init() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for older browsers
      this.fallbackAnimation();
    }
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          this.observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    this.animatedElements.forEach(element => {
      element.classList.add('animate-ready');
      this.observer.observe(element);
    });
  }

  fallbackAnimation() {
    // Simple fallback - show all elements
    this.animatedElements.forEach(element => {
      element.classList.add('animate-in');
    });
  }
}

// ==========================================================================
// Performance Optimizations
// ==========================================================================

class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.preloadCriticalResources();
    this.optimizeScrollPerformance();
  }

  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  }

  preloadCriticalResources() {
    // Preload hero section background if needed
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
      const bgImage = window.getComputedStyle(heroBackground).backgroundImage;
      if (bgImage && bgImage !== 'none') {
        const img = new Image();
        img.src = bgImage.slice(4, -1).replace(/"/g, '');
      }
    }
  }

  optimizeScrollPerformance() {
    // Use passive event listeners for better scroll performance
    let ticking = false;

    function updateScrollElements() {
      // Update any scroll-dependent elements here
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateScrollElements);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
  }
}

// ==========================================================================
// Accessibility Enhancements
// ==========================================================================

class AccessibilityEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupAriaLabels();
    this.setupReducedMotion();
  }

  setupKeyboardNavigation() {
    // Handle keyboard navigation for custom elements
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  setupFocusManagement() {
    // Ensure focus is visible and properly managed
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.classList.add('focused');
      });

      element.addEventListener('blur', () => {
        element.classList.remove('focused');
      });
    });
  }

  setupAriaLabels() {
    // Dynamically add aria-labels where needed
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
      if (!link.getAttribute('aria-label')) {
        const text = link.textContent.trim();
        link.setAttribute('aria-label', `${text} (ouvre dans un nouvel onglet)`);
      }
    });
  }

  setupReducedMotion() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.body.classList.add('reduced-motion');
    }

    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
      }
    });
  }
}

// ==========================================================================
// Loading Manager
// ==========================================================================

class LoadingManager {
  constructor() {
    this.loadingElement = document.getElementById('loading');
    this.init();
  }

  init() {
    // Hide loading screen when page is fully loaded
    if (document.readyState === 'complete') {
      this.hideLoading();
    } else {
      window.addEventListener('load', () => this.hideLoading());
    }

    // Fallback timeout
    setTimeout(() => this.hideLoading(), 3000);
  }

  showLoading() {
    if (this.loadingElement) {
      this.loadingElement.classList.add('active');
      this.loadingElement.setAttribute('aria-hidden', 'false');
    }
  }

  hideLoading() {
    if (this.loadingElement) {
      this.loadingElement.classList.remove('active');
      this.loadingElement.setAttribute('aria-hidden', 'true');
    }
  }
}

// ==========================================================================
// Error Handling
// ==========================================================================

class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    // Global error handling
    window.addEventListener('error', (e) => {
      console.error('JavaScript Error:', e.error);
      this.logError('JavaScript Error', e.error);
    });

    // Promise rejection handling
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled Promise Rejection:', e.reason);
      this.logError('Promise Rejection', e.reason);
    });
  }

  logError(type, error) {
    // In a production environment, you might want to send errors to a logging service
    const errorInfo = {
      type,
      message: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // For now, just log to console
    console.error('Error logged:', errorInfo);
  }
}

// ==========================================================================
// Application Initialization
// ==========================================================================

class PortfolioApp {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize all components
      this.components.errorHandler = new ErrorHandler();
      this.components.loadingManager = new LoadingManager();
      this.components.navigation = new Navigation();
      this.components.scrollAnimations = new ScrollAnimations();
      this.components.performanceOptimizer = new PerformanceOptimizer();
      this.components.accessibilityEnhancer = new AccessibilityEnhancer();

      // Mark app as initialized
      document.body.classList.add('app-initialized');
      
      console.log('Portfolio app initialized successfully');
    } catch (error) {
      console.error('Failed to initialize portfolio app:', error);
    }
  }

  // Public method to get component instances
  getComponent(name) {
    return this.components[name];
  }
}

// ==========================================================================
// Initialize Application
// ==========================================================================

// Create global app instance
window.portfolioApp = new PortfolioApp();

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioApp;
}