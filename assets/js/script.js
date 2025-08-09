// Generic carousel setup function
function setupCarousel(type, data, itemsPerSlide, createItemFunction) {
    const wrapper = document.getElementById(`${type}sWrapper`);
    wrapper.className = 'carousel-container';
    
    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = 'carousel-wrapper';
    carouselWrapper.id = `${type}CarouselWrapper`;
    
    // Create slides
    for (let i = 0; i < data.length; i += itemsPerSlide) {
        const slide = document.createElement('div');
        slide.className = 'carousel-item';
        
        const grid = document.createElement('div');
        grid.className = `${type}-wrapper`;
        
        const slideData = data.slice(i, i + itemsPerSlide);
        slideData.forEach((item, index) => {
            grid.appendChild(createItemFunction(item, i + index));
        });
        
        slide.appendChild(grid);
        carouselWrapper.appendChild(slide);
    }
    
    wrapper.appendChild(carouselWrapper);
    
    // Show carousel arrows
    document.querySelector(`.${type}-arrows`).classList.add('show');
    
    // Initialize carousel with a small delay to ensure DOM is ready
    setTimeout(() => {
        initCarousel(type);
    }, 100);
}

// Initialize carousel functionality
function initCarousel(type) {
    const wrapper = document.getElementById(`${type}CarouselWrapper`);
    const prevBtn = document.getElementById(`${type}sPrev`);
    const nextBtn = document.getElementById(`${type}sNext`);
    
    if (!wrapper || !prevBtn || !nextBtn) {
        console.error(`Carousel elements not found for ${type}`);
        return;
    }
    
    const slides = wrapper.querySelectorAll('.carousel-item');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    if (totalSlides <= 1) {
        // Hide arrows if only one slide
        document.querySelector(`.${type}-arrows`).classList.remove('show');
        return;
    }
    
    // Auto-play functionality
    let autoPlayInterval;
    
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, 4000);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    function updateCarousel() {
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
        
        // Add visual feedback for disabled buttons
        if (currentSlide === 0) {
            prevBtn.style.opacity = '0.5';
        } else {
            prevBtn.style.opacity = '1';
        }
        
        if (currentSlide === totalSlides - 1) {
            nextBtn.style.opacity = '0.5';
        } else {
            nextBtn.style.opacity = '1';
        }
    }
    
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
        } else {
            currentSlide = 0; // Loop back to first slide
        }
        updateCarousel();
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = totalSlides - 1; // Loop to last slide
        }
        updateCarousel();
    }
    
    // Remove existing event listeners to prevent duplicates
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    
    // Add event listeners
    newNextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });
    
    newPrevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });
    
    // Pause autoplay on hover
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);
    
    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    });
    
    wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
        }
    }
    
    // Initialize
    updateCarousel();
    startAutoPlay();
}
            // Global variables
let currentTheme = {};
let servicesData = [];
let pricingData = [];
let clientsData = [];
let testimonialsData = [];

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    // Load all data
    loadAllData();
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize header scroll effect
    initHeaderScroll();
});

// Load all data from JSON files
async function loadAllData() {
    try {
        await Promise.all([
            loadTheme(),
            loadHeroData(),
            loadAboutData(),
            loadServicesData(),
            loadPricingData(),
            loadClientsData(),
            loadTestimonialsData(),
            loadFooterData()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Load theme configuration
async function loadTheme() {
    try {
        const response = await fetch('_data/theme.json');
        currentTheme = await response.json();
        applyTheme();
    } catch (error) {
        console.error('Error loading theme:', error);
    }
}

// Apply theme to CSS variables
function applyTheme() {
    if (currentTheme.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', currentTheme.primaryColor);
        document.documentElement.style.setProperty('--primary-light', lightenColor(currentTheme.primaryColor, 20));
        document.documentElement.style.setProperty('--primary-dark', darkenColor(currentTheme.primaryColor, 20));
    }
    
    if (currentTheme.logo) {
        document.getElementById('headerLogo').src = currentTheme.logo;
        document.getElementById('footerLogo').src = currentTheme.logo;
    }
    
    if (currentTheme.favicon) {
        document.querySelector('link[rel="icon"]').href = currentTheme.favicon;
    }
}

// Load hero section data
async function loadHeroData() {
    try {
        const response = await fetch('_data/hero.json');
        const heroData = await response.json();
        
        document.getElementById('heroTitle').textContent = heroData.title;
        document.getElementById('heroSubtitle').textContent = heroData.subtitle;
        document.getElementById('heroCtaText').textContent = heroData.ctaText;
        document.getElementById('heroCtaButton').href = heroData.ctaLink;
    } catch (error) {
        console.error('Error loading hero data:', error);
    }
}

// Load about section data with image sizing
async function loadAboutData() {
    try {
        const response = await fetch('_data/about.json');
        const aboutData = await response.json();
        
        document.getElementById('aboutTitle').textContent = aboutData.title;
        document.getElementById('aboutText').textContent = aboutData.text;
        
        if (aboutData.image) {
            const img = document.getElementById('aboutImage');
            img.src = aboutData.image;
            
            // Apply image settings if available
            if (aboutData.imageSettings) {
                if (aboutData.imageSettings.width) {
                    img.style.width = aboutData.imageSettings.width + 'px';
                }
                if (aboutData.imageSettings.height) {
                    img.style.height = aboutData.imageSettings.height + 'px';
                    img.style.objectFit = 'cover';
                }
                if (aboutData.imageSettings.borderRadius) {
                    img.style.borderRadius = aboutData.imageSettings.borderRadius + 'px';
                }
            }
        }
    } catch (error) {
        console.error('Error loading about data:', error);
    }
}

// Load services data
async function loadServicesData() {
    try {
        const response = await fetch('_data/services.json');
        const data = await response.json();
        servicesData = data.services;
        
        document.getElementById('servicesTitle').textContent = data.title;
        renderServices();
    } catch (error) {
        console.error('Error loading services data:', error);
    }
}

// Render services section
function renderServices() {
    const wrapper = document.getElementById('servicesWrapper');
    wrapper.innerHTML = '';
    
    if (servicesData.length <= 4) {
        // Show all services in grid
        wrapper.className = 'services-wrapper';
        servicesData.forEach((service, index) => {
            wrapper.appendChild(createServiceItem(service, index));
        });
        // Hide arrows if not needed
        document.querySelector('.services-arrows').classList.remove('show');
    } else {
        // Create carousel
        setupCarousel('services', servicesData, 4, createServiceItem);
    }
}

// Create service item element
function createServiceItem(service, index) {
    const item = document.createElement('div');
    item.className = 'service-item';
    item.setAttribute('data-aos', 'fade-up');
    item.setAttribute('data-aos-delay', (index % 4) * 100);
    
    item.innerHTML = `
        <div class="service-icon">
            <i class="${service.icon}"></i>
        </div>
        <h3>${service.name}</h3>
        <p>${service.description}</p>
    `;
    
    return item;
}

// Load pricing data
async function loadPricingData() {
    try {
        const response = await fetch('_data/pricing.json');
        const data = await response.json();
        pricingData = data.plans;
        
        document.getElementById('pricingTitle').textContent = data.title;
        renderPricing();
    } catch (error) {
        console.error('Error loading pricing data:', error);
    }
}

// Render pricing section
function renderPricing() {
    const wrapper = document.getElementById('pricingWrapper');
    wrapper.innerHTML = '';
    
    if (pricingData.length <= 3) {
        // Show all plans in grid
        wrapper.className = 'pricing-wrapper';
        pricingData.forEach((plan, index) => {
            wrapper.appendChild(createPricingCard(plan, index));
        });
        // Hide arrows if not needed
        document.querySelector('.pricing-arrows').classList.remove('show');
    } else {
        // Create carousel
        setupCarousel('pricing', pricingData, 3, createPricingCard);
    }
}

// Create pricing card element
function createPricingCard(plan, index) {
    const card = document.createElement('div');
    card.className = `pricing-card ${plan.popular ? 'popular' : ''}`;
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index % 3) * 100);
    
    const featuresHtml = plan.features.map(feature => `<li>${feature}</li>`).join('');
    
    card.innerHTML = `
        ${plan.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
        <h3>${plan.name}</h3>
        <div class="price">${plan.price}</div>
        <ul class="pricing-features">
            ${featuresHtml}
        </ul>
    `;
    
    return card;
}

// Load clients data
async function loadClientsData() {
    try {
        const response = await fetch('_data/clients.json');
        const data = await response.json();
        clientsData = data.clients;
        
        document.getElementById('clientsTitle').textContent = data.title;
        renderClients();
    } catch (error) {
        console.error('Error loading clients data:', error);
    }
}

// Render clients section
function renderClients() {
    const wrapper = document.getElementById('clientsWrapper');
    wrapper.innerHTML = '';
    
    if (clientsData.length <= 3) {
        // Show all clients in grid
        wrapper.className = 'clients-wrapper';
        clientsData.forEach((client, index) => {
            wrapper.appendChild(createClientItem(client, index));
        });
        // Hide arrows if not needed
        document.querySelector('.clients-arrows').classList.remove('show');
    } else {
        // Create carousel
        setupCarousel('clients', clientsData, 3, createClientItem);
    }
}

// Create client item element with sizing
function createClientItem(client, index) {
    const item = document.createElement('div');
    item.className = 'client-item';
    item.setAttribute('data-aos', 'fade-up');
    item.setAttribute('data-aos-delay', (index % 3) * 100);
    
    // Apply custom sizing if available
    let logoStyle = '';
    let websiteStyle = '';
    
    if (client.logoSize) {
        logoStyle = `width: ${client.logoSize.width || 120}px; height: ${client.logoSize.height || 80}px;`;
    }
    
    if (client.websiteSize) {
        websiteStyle = `height: ${client.websiteSize.height || 200}px;`;
    }
    
    item.innerHTML = `
        <img src="${client.logo}" alt="${client.name} Logo" class="client-logo" style="${logoStyle}">
        <img src="${client.websiteImage}" alt="${client.name} Website" class="client-website" style="${websiteStyle}">
        <div class="client-name">${client.name}</div>
    `;
    
    return item;
}

// Load testimonials data
async function loadTestimonialsData() {
    try {
        const response = await fetch('_data/testimonials.json');
        const data = await response.json();
        testimonialsData = data.testimonials;
        
        document.getElementById('testimonialsTitle').textContent = data.title;
        renderTestimonials();
    } catch (error) {
        console.error('Error loading testimonials data:', error);
    }
}

// Render testimonials section
function renderTestimonials() {
    const wrapper = document.getElementById('testimonialsWrapper');
    wrapper.innerHTML = '';
    
    if (testimonialsData.length <= 3) {
        // Show all testimonials in grid
        wrapper.className = 'testimonials-wrapper';
        testimonialsData.forEach((testimonial, index) => {
            wrapper.appendChild(createTestimonialItem(testimonial, index));
        });
        // Hide arrows if not needed
        document.querySelector('.testimonials-arrows').classList.remove('show');
    } else {
        // Create carousel
        setupCarousel('testimonials', testimonialsData, 3, createTestimonialItem);
    }
}

// Create testimonial item element with sizing
function createTestimonialItem(testimonial, index) {
    const item = document.createElement('div');
    item.className = 'testimonial-item';
    item.setAttribute('data-aos', 'fade-up');
    item.setAttribute('data-aos-delay', (index % 3) * 100);
    
    // Apply custom photo sizing if available
    let photoStyle = '';
    if (testimonial.photoSize) {
        const size = testimonial.photoSize.size || 60;
        photoStyle = `width: ${size}px; height: ${size}px;`;
    }
    
    item.innerHTML = `
        <div class="testimonial-header">
            <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-image" style="${photoStyle}">
            <div class="testimonial-name">${testimonial.name}</div>
        </div>
        <div class="testimonial-comment">"${testimonial.comment}"</div>
    `;
    
    return item;
}

// Load footer data
async function loadFooterData() {
    try {
        const response = await fetch('_data/footer.json');
        const footerData = await response.json();
        
        document.getElementById('footerEmail').textContent = footerData.email;
        document.getElementById('footerPhone').textContent = footerData.phone;
        document.getElementById('footerAddress').textContent = footerData.address;
        document.getElementById('contactEmail').textContent = footerData.email;
        document.getElementById('contactPhone').textContent = footerData.phone;
        document.getElementById('contactAddress').textContent = footerData.address;
        
        // Set social links
        if (footerData.social.facebook) {
            document.getElementById('socialFacebook').href = footerData.social.facebook;
        }
        if (footerData.social.x) {
            document.getElementById('socialX').href = footerData.social.x;
        }
        if (footerData.social.linkedin) {
            document.getElementById('socialLinkedin').href = footerData.social.linkedin;
        }
        if (footerData.social.instagram) {
            document.getElementById('socialInstagram').href = footerData.social.instagram;
        }
        if (footerData.social.whatsapp) {
            document.getElementById('socialWhatsapp').href = footerData.social.whatsapp;
        }
    } catch (error) {
        console.error('Error loading footer data:', error);
    }
}

// Initialize carousel functionality
function initCarousel(type) {
    const wrapper = document.querySelector(`#${type}sWrapper .carousel-wrapper`);
    const prevBtn = document.getElementById(`${type}sPrev`);
    const nextBtn = document.getElementById(`${type}sNext`);
    const slides = wrapper.querySelectorAll('.carousel-item');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Auto-play functionality
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, 4000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    function updateCarousel() {
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
        } else {
            currentSlide = 0; // Loop back to first slide
        }
        updateCarousel();
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = totalSlides - 1; // Loop to last slide
        }
        updateCarousel();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        nextSlide();
        startAutoPlay();
    });
    
    prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        prevSlide();
        startAutoPlay();
    });
    
    // Pause autoplay on hover
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);
    
    // Initialize
    updateCarousel();
    startAutoPlay();
}

// Initialize mobile navigation
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Initialize smooth scrolling
function initSmoothScrolling() {
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

// Initialize contact form
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<div class="loading"></div> Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            // Simulate form submission (replace with actual form handler)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
        } catch (error) {
            alert('Sorry, there was an error sending your message. Please try again.');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Initialize header scroll effect
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Utility functions for color manipulation
function lightenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
        (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
        (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
}
