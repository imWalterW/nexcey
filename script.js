// Mobile Navigation
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.sticky-header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Add animate-on-scroll class to sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('animate-on-scroll');
    observer.observe(section);
});

// Carousel functionality
class Carousel {
    constructor(container, prevBtn, nextBtn) {
        this.container = container;
        this.slide = container.querySelector('.carousel-slide');
        this.prevBtn = prevBtn;
        this.nextBtn = nextBtn;
        this.currentIndex = 0;
        this.items = this.slide.children;
        this.itemsPerView = this.getItemsPerView();
        this.maxIndex = Math.max(0, this.items.length - this.itemsPerView);
        
        this.init();
    }
    
    getItemsPerView() {
        return window.innerWidth <= 768 ? 1 : 3;
    }
    
    init() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Auto-slide every 5 seconds
        setInterval(() => this.next(), 5000);
        
        // Update on window resize
        window.addEventListener('resize', () => {
            this.itemsPerView = this.getItemsPerView();
            this.maxIndex = Math.max(0, this.items.length - this.itemsPerView);
            this.updateSlide();
        });
    }
    
    prev() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.maxIndex;
        this.updateSlide();
    }
    
    next() {
        this.currentIndex = this.currentIndex < this.maxIndex ? this.currentIndex + 1 : 0;
        this.updateSlide();
    }
    
    updateSlide() {
        const translateX = -(this.currentIndex * (100 / this.itemsPerView));
        this.slide.style.transform = `translateX(${translateX}%)`;
    }
}

// Initialize carousels
document.addEventListener('DOMContentLoaded', () => {
    // Clients carousel
    const clientsCarousel = document.getElementById('clients-carousel');
    const clientsPrev = document.getElementById('clients-prev');
    const clientsNext = document.getElementById('clients-next');
    
    if (clientsCarousel && clientsPrev && clientsNext) {
        new Carousel(clientsCarousel, clientsPrev, clientsNext);
    }
    
    // Testimonials carousel
    const testimonialsCarousel = document.getElementById('testimonials-carousel');
    const testimonialsPrev = document.getElementById('testimonials-prev');
    const testimonialsNext = document.getElementById('testimonials-next');
    
    if (testimonialsCarousel && testimonialsPrev && testimonialsNext) {
        new Carousel(testimonialsCarousel, testimonialsPrev, testimonialsNext);
    }
});

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');
        
        // Create mailto link
        const subject = `Contact from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:info@nexcey.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        alert('Thank you for your message! Your email client should open now.');
        
        // Reset form
        this.reset();
    });
}

// Pricing plan buttons
document.querySelectorAll('.plan-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.pricing-card');
        const planName = card.querySelector('.plan-name').textContent;
        const planPrice = card.querySelector('.plan-price').textContent;
        
        // Create mailto link for pricing inquiry
        const subject = `Inquiry about ${planName}`;
        const body = `Hi,\n\nI'm interested in the ${planName} (${planPrice}) and would like more information.\n\nPlease contact me to discuss the details.\n\nThank you!`;
        const mailtoLink = `mailto:info@nexcey.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        window.location.href = mailtoLink;
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Loading animation for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // Add loading class
        img.classList.add('loading');
    });
});

// Theme color management (for admin dashboard)
function updateThemeColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    
    // Update related colors
    const primaryLight = adjustBrightness(color, 40);
    const primaryDark = adjustBrightness(color, -40);
    
    document.documentElement.style.setProperty('--primary-light', primaryLight);
    document.documentElement.style.setProperty('--primary-dark', primaryDark);
    document.documentElement.style.setProperty('--gradient', `linear-gradient(135deg, ${color} 0%, ${primaryLight} 100%)`);
}

function adjustBrightness(hex, percent) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse r, g, b values
    const num = parseInt(hex, 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// Initialize theme from localStorage if available
document.addEventListener('DOMContentLoaded', () => {
    const savedColor = localStorage.getItem('nexcey-primary-color');
    if (savedColor) {
        updateThemeColor(savedColor);
    }
    
    // Load saved content if available
    loadSavedContent();
});

// Content management functions
function loadSavedContent() {
    const savedData = localStorage.getItem('nexcey-content');
    if (savedData) {
        try {
            const content = JSON.parse(savedData);
            
            // Update hero section
            if (content.hero) {
                const heroTitle = document.getElementById('hero-title');
                const heroSubtitle = document.getElementById('hero-subtitle');
                const heroCta = document.getElementById('hero-cta');
                
                if (heroTitle && content.hero.title) heroTitle.textContent = content.hero.title;
                if (heroSubtitle && content.hero.subtitle) heroSubtitle.textContent = content.hero.subtitle;
                if (heroCta && content.hero.cta) heroCta.textContent = content.hero.cta;
            }
            
            // Update about section
            if (content.about) {
                const aboutTitle = document.getElementById('about-title');
                const aboutText = document.getElementById('about-text');
                
                if (aboutTitle && content.about.title) aboutTitle.textContent = content.about.title;
                if (aboutText && content.about.text) aboutText.textContent = content.about.text;
            }
            
            // Update contact info
            if (content.contact) {
                const contactEmail = document.getElementById('contact-email');
                const contactPhone = document.getElementById('contact-phone');
                const contactAddress = document.getElementById('contact-address');
                const footerEmail = document.getElementById('footer-email');
                const footerPhone = document.getElementById('footer-phone');
                const footerAddress = document.getElementById('footer-address');
                
                if (contactEmail && content.contact.email) contactEmail.textContent = content.contact.email;
                if (contactPhone && content.contact.phone) contactPhone.textContent = content.contact.phone;
                if (contactAddress && content.contact.address) contactAddress.textContent = content.contact.address;
                if (footerEmail && content.contact.email) footerEmail.textContent = content.contact.email;
                if (footerPhone && content.contact.phone) footerPhone.textContent = content.contact.phone;
                if (footerAddress && content.contact.address) footerAddress.textContent = content.contact.address;
            }
            
            // Update social links
            if (content.social) {
                Object.keys(content.social).forEach(platform => {
                    const link = document.getElementById(`${platform}-link`);
                    if (link && content.social[platform]) {
                        link.href = content.social[platform];
                    }
                });
            }
            
        } catch (error) {
            console.error('Error loading saved content:', error);
        }
    }
}