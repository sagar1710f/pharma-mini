// DOM Elements for mobile menu and newsletter
const mobileMenuButton = document.querySelector('.md\\:hidden');
const mobileMenu = document.querySelector('.md\\:flex');
const newsletterForm = document.querySelector('footer form');

// Mobile menu functionality
function initializeMobileMenu() {
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Newsletter form submission
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('#newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            if (email) {
                alert('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
            }
        });
    }
}

// Smooth scroll functionality
function initializeSmoothScroll() {
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
}

// Initialize all functionality
function initializeApp() {
    initializeMobileMenu();
    initializeNewsletterForm();
    initializeSmoothScroll();
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp); 