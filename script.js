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

// Complete CMS Data Loading System
// Add this to your existing script.js file

async function loadAllCMSData() {
    console.log('🔄 Loading CMS data...');
    
    // Set your GitHub details here
    const GITHUB_USERNAME = 'imWalterW'; // Replace with your GitHub username
    const REPO_NAME = 'nexcey';             // Replace with your repository name
    
    try {
        await Promise.all([
            loadHeroData(GITHUB_USERNAME, REPO_NAME),
            loadAboutData(GITHUB_USERNAME, REPO_NAME),
            loadContactData(GITHUB_USERNAME, REPO_NAME),
            loadSocialData(GITHUB_USERNAME, REPO_NAME),
            loadServicesData(GITHUB_USERNAME, REPO_NAME),
            loadPricingData(GITHUB_USERNAME, REPO_NAME),
            loadClientsData(GITHUB_USERNAME, REPO_NAME),
            loadTestimonialsData(GITHUB_USERNAME, REPO_NAME),
            loadSettingsData(GITHUB_USERNAME, REPO_NAME)
        ]);
        
        console.log('✅ All CMS data loaded successfully!');
    } catch (error) {
        console.log('⚠️ Using default content (CMS data not available)');
    }
}

// Load Hero Section Data
async function loadHeroData(username, repo) {
    try {
        const data = await fetchCMSFile(username, repo, '_data/hero.json');
        if (!data) return;
        
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const heroCta = document.getElementById('hero-cta');
        
        if (heroTitle && data.title) heroTitle.textContent = data.title;
        if (heroSubtitle && data.subtitle) heroSubtitle.textContent = data.subtitle;
        if (heroCta && data.cta_text) heroCta.textContent = data.cta_text;
        
        console.log('✅ Hero data loaded');
    } catch (error) {
        console.log('⚠️ Hero data not found, using defaults');
    }
}

// Load About Section Data
async function loadAboutData(username, repo) {
    try {
        const data = await fetchCMSFile(username, repo, '_data/about.json');
        if (!data) return;
        
        const aboutTitle = document.getElementById('about-title');
        const aboutText = document.getElementById('about-text');
        const aboutImg = document.getElementById('about-img');
        
        if (aboutTitle && data.title) aboutTitle.textContent = data.title;
        if (aboutText && data.text) aboutText.textContent = data.text;
        if (aboutImg && data.image) aboutImg.src = data.image;
        
        console.log('✅ About data loaded');
    } catch (error) {
        console.log('⚠️ About data not found, using defaults');
    }
}

// Load Contact Information
async function loadContactData(username, repo) {
    try {
        const data = await fetchCMSFile(username, repo, '_data/contact.json');
        if (!data) return;
        
        // Update all contact info elements
        const contactElements = {
            'contact-email': data.email,
            'contact-phone': data.phone,
            'contact-address': data.address,
            'footer-email': data.email,
            'footer-phone': data.phone,
            'footer-address': data.address
        };
        
        Object.keys(contactElements).forEach(id => {
            const element = document.getElementById(id);
            if (element && contactElements[id]) {
                element.textContent = contactElements[id];
            }
        });
        
        // Update contact form action if email changed
        const contactForm = document.getElementById('contact-form');
        if (contactForm && data.email) {
            updateContactFormEmail(data.email);
        }
        
        console.log('✅ Contact data loaded');
    } catch (error) {
        console.log('⚠️ Contact data not found, using defaults');
    }
}

// Load Social Media Links
async function loadSocialData(username, repo) {
    try {
        const data = await fetchCMSFile(username, repo, '_data/social.json');
        if (!data) return;
        
        const socialLinks = {
            'facebook-link': data.facebook,
            'x-link': data.twitter,
            'linkedin-link': data.linkedin,
            'instagram-link': data.instagram,
            'whatsapp-link': data.whatsapp
        };
        
        Object.keys(socialLinks).forEach(id => {
            const element = document.getElementById(id);
            if (element && socialLinks[id]) {
                element.href = socialLinks[id];
                element.style.display = 'inline-block';
            } else if (element) {
                element.style.display = 'none';
            }
        });
        
        console.log('✅ Social media data loaded');
    } catch (error) {
        console.log('⚠️ Social media data not found, using defaults');
    }
}

// Load Services Data
async function loadServicesData(username, repo) {
    try {
        const files = await fetchCMSFolder(username, repo, '_data/services');
        if (!files || files.length === 0) return;
        
        const services = [];
        
        // Load each service file
        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const content = await fetch(file.download_url).then(res => res.text());
                const service = parseMarkdownFile(content);
                if (service.title && service.description) {
                    services.push(service);
                }
            }
        }
        
        // Sort by order
        services.sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));
        
        // Update services display
        updateServicesDisplay(services);
        
        console.log('✅ Services data loaded');
    } catch (error) {
        console.log('⚠️ Services data not found, using defaults');
    }
}

// Load Pricing Plans Data
async function loadPricingData(username, repo) {
    try {
        const files = await fetchCMSFolder(username, repo, '_data/pricing');
        if (!files || files.length === 0) return;
        
        const pricingPlans = [];
        
        // Load each pricing file
        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const content = await fetch(file.download_url).then(res => res.text());
                const plan = parseMarkdownFile(content);
                if (plan.name && plan.price) {
                    pricingPlans.push(plan);
                }
            }
        }
        
        // Sort by order
        pricingPlans.sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));
        
        // Update pricing display
        updatePricingDisplay(pricingPlans);
        
        console.log('✅ Pricing data loaded');
    } catch (error) {
        console.log('⚠️ Pricing data not found, using defaults');
    }
}

// Load Clients Data
async function loadClientsData(username, repo) {
    try {
        const files = await fetchCMSFolder(username, repo, '_data/clients');
        if (!files || files.length === 0) return;
        
        const clients = [];
        
        // Load each client file
        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const content = await fetch(file.download_url).then(res => res.text());
                const client = parseMarkdownFile(content);
                if (client.name) {
                    clients.push(client);
                }
            }
        }
        
        // Sort by order
        clients.sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));
        
        // Update clients display
        updateClientsDisplay(clients);
        
        console.log('✅ Clients data loaded');
    } catch (error) {
        console.log('⚠️ Clients data not found, using defaults');
    }
}

// Load Testimonials Data
async function loadTestimonialsData(username, repo) {
    try {
        const files = await fetchCMSFolder(username, repo, '_data/testimonials');
        if (!files || files.length === 0) return;
        
        const testimonials = [];
        
        // Load each testimonial file
        for (const file of files) {
            if (file.name.endsWith('.md')) {
                const content = await fetch(file.download_url).then(res => res.text());
                const testimonial = parseMarkdownFile(content);
                if (testimonial.name && testimonial.comment) {
                    testimonials.push(testimonial);
                }
            }
        }
        
        // Sort by order
        testimonials.sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));
        
        // Update testimonials display
        updateTestimonialsDisplay(testimonials);
        
        console.log('✅ Testimonials data loaded');
    } catch (error) {
        console.log('⚠️ Testimonials data not found, using defaults');
    }
}

// Load General Settings
async function loadSettingsData(username, repo) {
    try {
        const data = await fetchCMSFile(username, repo, '_data/settings.json');
        if (!data) return;
        
        // Update site title
        if (data.site_title) {
            document.title = data.site_title;
        }
        
        // Update primary color
        if (data.primary_color) {
            updateThemeColor(data.primary_color);
        }
        
        // Update logo
        if (data.logo) {
            const logoElements = document.querySelectorAll('#logo-img, #footer-logo');
            logoElements.forEach(logo => {
                if (logo) logo.src = data.logo;
            });
        }
        
        // Update favicon
        if (data.favicon) {
            const favicon = document.querySelector('link[rel="icon"]');
            if (favicon) favicon.href = data.favicon;
        }
        
        console.log('✅ Settings data loaded');
    } catch (error) {
        console.log('⚠️ Settings data not found, using defaults');
    }
}

// Utility Functions
async function fetchCMSFile(username, repo, filePath) {
    try {
        const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) return null;
        
        const fileData = await response.json();
        const content = atob(fileData.content);
        
        return JSON.parse(content);
    } catch (error) {
        console.log(`Could not load ${filePath}:`, error);
        return null;
    }
}

async function fetchCMSFolder(username, repo, folderPath) {
    try {
        const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${folderPath}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) return [];
        
        return await response.json();
    } catch (error) {
        console.log(`Could not load folder ${folderPath}:`, error);
        return [];
    }
}

function parseMarkdownFile(content) {
    const lines = content.split('\n');
    const data = {};
    let inFrontmatter = false;
    let inFeatures = false;
    
    for (const line of lines) {
        if (line.trim() === '---') {
            inFrontmatter = !inFrontmatter;
            continue;
        }
        
        if (inFrontmatter && line.includes(':')) {
            const [key, ...valueParts] = line.split(':');
            const value = valueParts.join(':').trim();
            
            if (key.trim() === 'features') {
                data.features = [];
                inFeatures = true;
            } else {
                data[key.trim()] = value.replace(/['"]/g, '');
                inFeatures = false;
            }
        }
        
        if (inFrontmatter && inFeatures && line.startsWith('  - ')) {
            if (!data.features) data.features = [];
            data.features.push(line.replace('  - ', '').trim());
        }
    }
    
    return data;
}

// Display Update Functions
function updateServicesDisplay(services) {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid || services.length === 0) return;
    
    // Clear existing services
    servicesGrid.innerHTML = '';
    
    // Add each service
    services.forEach(service => {
        const serviceHTML = `
            <div class="service-item">
                <i class="${service.icon || 'fas fa-laptop-code'} service-icon"></i>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
            </div>
        `;
        servicesGrid.insertAdjacentHTML('beforeend', serviceHTML);
    });
}

function updatePricingDisplay(plans) {
    const pricingGrid = document.getElementById('pricing-grid');
    if (!pricingGrid || plans.length === 0) return;
    
    // Clear existing plans
    pricingGrid.innerHTML = '';
    
    // Add each plan
    plans.forEach(plan => {
        const planHTML = `
            <div class="pricing-card ${plan.featured === 'true' ? 'featured' : ''}" data-plan="${plan.name.toLowerCase()}">
                ${plan.featured === 'true' ? '<div class="featured-badge">Most Popular</div>' : ''}
                <h3 class="plan-name">${plan.name}</h3>
                <div class="plan-price">${plan.price}</div>
                <ul class="plan-features">
                    ${plan.features ? plan.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('') : ''}
                </ul>
                <button class="plan-button">Choose Plan</button>
            </div>
        `;
        pricingGrid.insertAdjacentHTML('beforeend', planHTML);
    });
    
    // Re-setup plan button functionality
    setupPlanButtons();
}

function updateClientsDisplay(clients) {
    const clientsCarousel = document.querySelector('#clients-carousel .carousel-slide');
    if (!clientsCarousel || clients.length === 0) return;
    
    // Clear existing clients
    clientsCarousel.innerHTML = '';
    
    // Add each client
    clients.forEach(client => {
        const clientHTML = `
            <div class="client-item">
                <img src="${client.logo}" alt="${client.name}" class="client-logo">
                <img src="${client.website_image}" alt="${client.name} Website" class="client-website">
            </div>
        `;
        clientsCarousel.insertAdjacentHTML('beforeend', clientHTML);
    });
}

function updateTestimonialsDisplay(testimonials) {
    const testimonialsCarousel = document.querySelector('#testimonials-carousel .carousel-slide');
    if (!testimonialsCarousel || testimonials.length === 0) return;
    
    // Clear existing testimonials
    testimonialsCarousel.innerHTML = '';
    
    // Add each testimonial
    testimonials.forEach(testimonial => {
        const testimonialHTML = `
            <div class="testimonial-item">
                <img src="${testimonial.photo}" alt="${testimonial.name}" class="testimonial-image">
                <h4 class="testimonial-name">${testimonial.name}</h4>
                <p class="testimonial-comment">"${testimonial.comment}"</p>
                ${testimonial.company ? `<small>${testimonial.company}</small>` : ''}
            </div>
        `;
        testimonialsCarousel.insertAdjacentHTML('beforeend', testimonialHTML);
    });
}

function updateContactFormEmail(email) {
    // Update the form submission email
    window.contactEmail = email;
}

function updateThemeColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    
    // Calculate lighter and darker variants
    const primaryLight = adjustBrightness(color, 40);
    const primaryDark = adjustBrightness(color, -40);
    
    document.documentElement.style.setProperty('--primary-light', primaryLight);
    document.documentElement.style.setProperty('--primary-dark', primaryDark);
    document.documentElement.style.setProperty('--gradient', `linear-gradient(135deg, ${color} 0%, ${primaryLight} 100%)`);
}

function adjustBrightness(hex, percent) {
    hex = hex.replace('#', '');
    const num = parseInt(hex, 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function setupPlanButtons() {
    document.querySelectorAll('.plan-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.pricing-card');
            const planName = card.querySelector('.plan-name').textContent;
            const planPrice = card.querySelector('.plan-price').textContent;
            
            const email = window.contactEmail || 'info@nexcey.com';
            const subject = `Inquiry about ${planName}`;
            const body = `Hi,\n\nI'm interested in the ${planName} (${planPrice}) and would like more information.\n\nPlease contact me to discuss the details.\n\nThank you!`;
            const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            window.location.href = mailtoLink;
        });
    });
}
// Add this function to your existing script.js
async function loadCMSContent() {
    console.log('🔄 Loading CMS content...');
    
    try {
        // Load hero data
        const heroResponse = await fetch('/_data/hero.json');
        if (heroResponse.ok) {
            const heroData = await heroResponse.json();
            updateHeroContent(heroData);
        }
        
        // Load about data
        const aboutResponse = await fetch('/_data/about.json');
        if (aboutResponse.ok) {
            const aboutData = await aboutResponse.json();
            updateAboutContent(aboutData);
        }
        
        // Load contact data
        const contactResponse = await fetch('/_data/contact.json');
        if (contactResponse.ok) {
            const contactData = await contactResponse.json();
            updateContactContent(contactData);
        }
        
        // Load social data
        const socialResponse = await fetch('/_data/social.json');
        if (socialResponse.ok) {
            const socialData = await socialResponse.json();
            updateSocialContent(socialData);
        }
        
        // Load settings
        const settingsResponse = await fetch('/_data/settings.json');
        if (settingsResponse.ok) {
            const settingsData = await settingsResponse.json();
            updateSiteSettings(settingsData);
        }
        
        console.log('✅ CMS content loaded successfully!');
        
    } catch (error) {
        console.log('⚠️ CMS content not available, using defaults');
    }
}

function updateHeroContent(data) {
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroCta = document.getElementById('hero-cta');
    
    if (heroTitle && data.title) heroTitle.textContent = data.title;
    if (heroSubtitle && data.subtitle) heroSubtitle.textContent = data.subtitle;
    if (heroCta && data.cta_text) heroCta.textContent = data.cta_text;
}

function updateAboutContent(data) {
    const aboutTitle = document.getElementById('about-title');
    const aboutText = document.getElementById('about-text');
    
    if (aboutTitle && data.title) aboutTitle.textContent = data.title;
    if (aboutText && data.text) aboutText.textContent = data.text;
}

function updateContactContent(data) {
    const elements = {
        'contact-email': data.email,
        'contact-phone': data.phone,
        'contact-address': data.address,
        'footer-email': data.email,
        'footer-phone': data.phone,
        'footer-address': data.address
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element && elements[id]) {
            element.textContent = elements[id];
        }
    });
}

function updateSocialContent(data) {
    const socialLinks = {
        'facebook-link': data.facebook,
        'x-link': data.twitter,
        'linkedin-link': data.linkedin,
        'instagram-link': data.instagram,
        'whatsapp-link': data.whatsapp
    };
    
    Object.keys(socialLinks).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (socialLinks[id]) {
                element.href = socialLinks[id];
                element.style.display = 'inline-block';
            } else {
                element.style.display = 'none';
            }
        }
    });
}

function updateSiteSettings(data) {
    // Update site title
    if (data.site_title) {
        document.title = data.site_title;
    }
    
    // Update theme color
    if (data.primary_color) {
        document.documentElement.style.setProperty('--primary-color', data.primary_color);
        
        // Calculate variations
        const primaryLight = adjustBrightness(data.primary_color, 40);
        const primaryDark = adjustBrightness(data.primary_color, -40);
        
        document.documentElement.style.setProperty('--primary-light', primaryLight);
        document.documentElement.style.setProperty('--primary-dark', primaryDark);
        document.documentElement.style.setProperty('--gradient', `linear-gradient(135deg, ${data.primary_color} 0%, ${primaryLight} 100%)`);
    }
}

// Initialize carousels
document.addEventListener('DOMContentLoaded', () => {
    // Clients carousel
    loadCMSData();
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
// Add this function to your existing script.js
async function loadCMSData() {
    try {
        // Load hero data
        const heroResponse = await fetch('/_data/hero.json');
        if (heroResponse.ok) {
            const heroData = await heroResponse.json();
            const heroTitle = document.getElementById('hero-title');
            const heroSubtitle = document.getElementById('hero-subtitle');
            const heroCta = document.getElementById('hero-cta');
            
            if (heroTitle) heroTitle.textContent = heroData.title;
            if (heroSubtitle) heroSubtitle.textContent = heroData.subtitle;
            if (heroCta) heroCta.textContent = heroData.cta_text;
        }
        
        // Load about data
        const aboutResponse = await fetch('/_data/about.json');
        if (aboutResponse.ok) {
            const aboutData = await aboutResponse.json();
            const aboutTitle = document.getElementById('about-title');
            const aboutText = document.getElementById('about-text');
            
            if (aboutTitle) aboutTitle.textContent = aboutData.title;
            if (aboutText) aboutText.textContent = aboutData.text;
        }
        
        // Load contact data
        const contactResponse = await fetch('/_data/contact.json');
        if (contactResponse.ok) {
            const contactData = await contactResponse.json();
            updateContactInfo(contactData);
        }
        
    } catch (error) {
        console.log('CMS data not available, using defaults');
    }
}



