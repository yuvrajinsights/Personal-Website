// Dynamic functionality for the website

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileNav();
    initSmoothScroll();
    initCollegeModals();
    initFormValidation();
    initAnimations();
    initMarqueeDuplication();
});

// Header scroll effect
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Mobile navigation toggle
function initMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = toggle.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            nav.classList.remove('active');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile nav if open
                const nav = document.querySelector('.nav');
                const toggle = document.querySelector('.mobile-toggle');
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const icon = toggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
}

// College gallery modals
function initCollegeModals() {
    const collegeCards = document.querySelectorAll('.college-card');
    const modals = document.querySelectorAll('.modal');
    
    collegeCards.forEach(card => {
        card.addEventListener('click', () => {
            const collegeId = card.dataset.college;
            const modal = document.getElementById(`modal-${collegeId}`);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modals
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = '';
        }
    });
}

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('.contact-inquiry-form');
    const contactDetails = document.getElementById('contact-details');
    const contactMessage = document.getElementById('contact-message');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = form.querySelector('[name="name"]');
            const email = form.querySelector('[name="email"]');
            const phone = form.querySelector('[name="phone"]');
            const message = form.querySelector('[name="message"]');
            
            let isValid = true;
            const errors = [];

            // Validate name
            if (name && name.value.trim() === '') {
                isValid = false;
                errors.push('Name is required');
                name.style.borderColor = '#ef4444';
            } else if (name) {
                name.style.borderColor = '';
            }

            // Validate email
            if (email && email.value.trim() === '') {
                isValid = false;
                errors.push('Email is required');
                email.style.borderColor = '#ef4444';
            } else if (email && !isValidEmail(email.value)) {
                isValid = false;
                errors.push('Please enter a valid email');
                email.style.borderColor = '#ef4444';
            } else if (email) {
                email.style.borderColor = '';
            }

            // Validate phone
            if (phone && phone.value.trim() === '') {
                isValid = false;
                errors.push('Phone number is required');
                phone.style.borderColor = '#ef4444';
            } else if (phone && !isValidPhone(phone.value)) {
                isValid = false;
                errors.push('Please enter a valid phone number');
                phone.style.borderColor = '#ef4444';
            } else if (phone) {
                phone.style.borderColor = '';
            }

            // Validate message
            if (message && message.value.trim() === '') {
                isValid = false;
                errors.push('Message is required');
                message.style.borderColor = '#ef4444';
            } else if (message) {
                message.style.borderColor = '';
            }

            if (isValid) {
                const formData = new FormData(form);
                formData.set('_subject', `Website enquiry from ${name.value.trim()}`);
                formData.set('_captcha', 'false');

                fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                }).then(data => {
                    showNotification('success', 'Message delivered - I\'ll get in contact with you at earliest.');
                    if (contactDetails) {
                        contactDetails.classList.remove('hidden');
                    }
                    if (contactMessage) {
                        contactMessage.textContent = 'Message delivered - I\'ll get in contact with you at earliest.';
                    }
                    form.reset();
                }).catch(() => {
                    showNotification('error', 'Direct send failed. Redirecting to the form provider for delivery.');
                    setTimeout(() => {
                        form.submit();
                    }, 800);
                });
            } else {
                showNotification('error', errors[0]);
            }
        });
    });
}

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Phone validation
function isValidPhone(phone) {
    return /^[+]?[\d\s-]{10,}$/.test(phone);
}

// Show notification
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Scroll animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll('.achievement-card, .session-card, .project-card, .education-card, .blog-card, .college-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add animate-in class styles
    setTimeout(() => {
        document.querySelectorAll('.animate-in').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 100);
}

// Duplicate marquee content for seamless scrolling
function initMarqueeDuplication() {
    const marquees = ['.clients-track', '.testimonials-track'];
    
    marquees.forEach(selector => {
        const track = document.querySelector(selector);
        if (!track) return;

        // Get original content
        const content = track.innerHTML;
        
        // Duplicate content twice for seamless loop
        track.innerHTML = content + content + content;
    });
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Counter animation for stats
function initCounterAnimation() {
    const counters = document.querySelectorAll('.hero-stat-number, .achievement-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.innerText.replace(/[^0-9]/g, ''));
                const suffix = counter.innerText.replace(/[0-9]/g, '');
                let current = 0;
                const increment = target / 50;
                const duration = 2000;
                const stepTime = duration / 50;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.floor(current) + suffix;
                        setTimeout(updateCounter, stepTime);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

// Initialize counter animation
initCounterAnimation();

// Add intersection observer polyfill for older browsers
if (!window.IntersectionObserver) {
    window.IntersectionObserver = class {
        constructor(callback) { callback([]); }
        observe() {}
        unobserve() {}
    };
}