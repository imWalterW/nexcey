// Clean, working JavaScript - no bullshit
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
    
    // Load all data
    loadAllData();
    initMobileNav();
    initContactForm();
    initHeaderScroll();
});

// Load all data
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

// Load theme
async function loadTheme() {
    try {
        const response = await fetch('_data/theme.json');
        const theme = await response.json();
        
        if (theme.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
        }
        
        const headerLogo = document.getElementById('headerLogo');
        const footerLogo = document.getElementById('footerLogo');
        
        if (theme.logo && headerLogo) headerLogo.src = theme.logo;
        if (theme.logo && footerLogo) footerLogo.src = theme.logo;
    } catch (error) {
        console.error('Theme loading failed:', error);
    }
}

// Load hero data
async function loadHeroData() {
    try {
        const response = await fetch('_data/hero.json');
        const hero = await response.json();
        
        const title = document.getElementById('heroTitle');
        const subtitle = document.getElementById('heroSubtitle');
        const ctaText = document.getElementById('heroCtaText');
        const ctaButton = document.getElementById('heroCtaButton');
        
        if (title) title.textContent = hero.title;
        if (subtitle) subtitle.textContent = hero.subtitle;
        if (ctaText) ctaText.textContent = hero.ctaText;
        if (ctaButton) ctaButton.href = hero.ctaLink;
    } catch (error) {
        console.error('Hero loading failed:', error);
    }
}

// Load about data
async function loadAboutData() {
    try {
        const response = await fetch('_data/about.json');
        const about = await response.json();
        
        const title = document.getElementById('aboutTitle');
        const text = document.getElementById('aboutText');
        const image = document.getElementById('aboutImage');
        
        if (title) title.textContent = about.title;
        if (text) text.textContent = about.text;
        if (image && about.image) image.src = about.image;
    } catch (error) {
        console.error('About loading failed:', error);
    }
}

// Load services data
async function loadServicesData() {
    try {
        const response = await fetch('_data/services.json');
        const data = await response.json();
        
        const title = document.getElementById('servicesTitle');
        const wrapper = document.getElementById('servicesWrapper');
        
        if (title) title.textContent = data.title;
        if (wrapper && data.services) {
            renderServices(data.services, wrapper);
        }
    } catch (error) {
        console.error('Services loading failed:', error);
    }
}

// Render services
function renderServices(services, wrapper) {
    wrapper.innerHTML = '';
    wrapper.className = 'services-wrapper';
    
    services.forEach((service, index) => {
        const item = document.createElement('div');
        item.className = 'service-item';
        item.setAttribute('data-aos', 'fade-up');
        item.setAttribute('data-aos-delay', index * 100);
        
        item.innerHTML = `
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
        `;
        
        wrapper.appendChild(item);
    });
    
    // Create carousel if more than 4 services
    if (services.length > 4) {
        createCarousel('services', wrapper, 4);
    }
}

// Load pricing data
async function loadPricingData() {
    try {
        const response = await fetch('_data/pricing.json');
        const data = await response.json();
        
        const title = document.getElementById('pricingTitle');
        const wrapper = document.getElementById('pricingWrapper');
        
        if (title) title.textContent = data.title;
        if (wrapper && data.plans) {
            renderPricing(data.plans, wrapper);
        }
    } catch (error) {
        console.error('Pricing loading failed:', error);
    }
}

// Render pricing
function renderPricing(plans, wrapper) {
    wrapper.innerHTML = '';
    wrapper.className = 'pricing-wrapper';
    
    plans.forEach((plan, index) => {
        const card = document.createElement('div');
        card.className = `pricing-card ${plan.popular ? 'popular' : ''}`;
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', index * 100);
        
        const features = plan.features.map(f => `<li>${f}</li>`).join('');
        
        card.innerHTML = `
            ${plan.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
            <h3>${plan.name}</h3>
            <div class="price">${plan.price}</div>
            <ul class="pricing-features">${features}</ul>
            <button class="pricing-btn">Choose Plan</button>
        `;
        
        wrapper.appendChild(card);
    });
    
    // Create carousel if more than 3 plans
    if (plans.length > 3) {
        createCarousel('pricing', wrapper, 3);
    }
}

// Load clients data
async function loadClientsData() {
    try {
        const response = await fetch('_data/clients.json');
        const data = await response.json();
        
        const title = document.getElementById('clientsTitle');
        const wrapper = document.getElementById('clientsWrapper');
        
        if (title) title.textContent = data.title;
        if (wrapper && data.clients) {
            renderClients(data.clients, wrapper);
        }
    } catch (error) {
        console.error('Clients loading failed:', error);
    }
}

// Render clients
function renderClients(clients, wrapper) {
    wrapper.innerHTML = '';
    wrapper.className = 'clients-wrapper';
    
    clients.forEach((client, index) => {
        const item = document.createElement('div');
        item.className = 'client-item';
        item.setAttribute('data-aos', 'fade-up');
        item.setAttribute('data-aos-delay', index * 100);
        
        item.innerHTML = `
            <img src="${client.logo}" alt="${client.name}" class="client-logo">
            <img src="${client.websiteImage}" alt="${client.name} Website" class="client-website">
            <div class="client-name">${client.name}</div>
        `;
        
        wrapper.appendChild(item);
    });
    
    // Create carousel if more than 3 clients
    if (clients.length > 3) {
        createCarousel('clients', wrapper, 3);
    }
}

// Load testimonials data
async function loadTestimonialsData() {
    try {
        const response = await fetch('_data/testimonials.json');
        const data = await response.json();
        
        const title = document.getElementById('testimonialsTitle');
        const wrapper = document.getElementById('testimonialsWrapper');
        
        if (title) title.textContent = data.title;
        if (wrapper && data.testimonials) {
            renderTestimonials(data.testimonials, wrapper);
        }
    } catch (error) {
        console.error('Testimonials loading failed:', error);
    }
}

// Render testimonials
function renderTestimonials(testimonials, wrapper) {
    wrapper.innerHTML = '';
    wrapper.className = 'testimonials-wrapper';
    
    testimonials.forEach((testimonial, index) => {
        const item = document.createElement('div');
        item.className = 'testimonial-item';
        item.setAttribute('data-aos', 'fade-up');
        item.setAttribute('data-aos-delay', index * 100);
        
        item.innerHTML = `
            <div class="testimonial-header">
                <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-image">
                <div class="testimonial-name">${testimonial.name}</div>
            </div>
            <div class="testimonial-comment">"${testimonial.comment}"</div>
        `;
        
        wrapper.appendChild(item);
    });
    
    // Create carousel if more than 3 testimonials
    if (testimonials.length > 3) {
        createCarousel('testimonials', wrapper, 3);
    }
}

// Load footer data
async function loadFooterData() {
    try {
        const response = await fetch('_data/footer.json');
        const footer = await response.json();
        
        const elements = {
            footerEmail: footer.email,
            footerPhone: footer.phone,
            footerAddress: footer.address,
            contactEmail: footer.email,
            contactPhone: footer.phone,
            contactAddress: footer.address
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
        
        // Set social links
        const socialLinks = {
            socialFacebook: footer.social.facebook,
            socialX: footer.social.x,
            socialLinkedin: footer.social.linkedin,
            socialInstagram: footer.social.instagram,
            socialWhatsapp: footer.social.whatsapp
        };
        
        Object.entries(socialLinks).forEach(([id, href]) => {
            const element = document.getElementById(id);
            if (element && href) element.href = href;
        });
    } catch (error) {
        console.error('Footer loading failed:', error);
    }
}

// Create manual carousel
function createCarousel(type, wrapper, itemsPerSlide) {
    const items = Array.from(wrapper.children);
    const totalItems = items.length;
    const totalSlides = Math.ceil(totalItems / itemsPerSlide);
    
    if (totalSlides <= 1) return;
    
    // Create carousel structure
    wrapper.innerHTML = '';
    wrapper.className = 'carousel-wrapper';
    
    const track = document.createElement('div');
    track.className = 'carousel-track';
    track.style.cssText = `
        display: flex;
        transition: transform 0.4s ease;
        width: ${totalSlides * 100}%;
    `;
    
    // Create slides
    for (let i = 0; i < totalSlides; i++) {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.style.cssText = `
            width: ${100 / totalSlides}%;
            display: grid;
            grid-template-columns: repeat(${Math.min(itemsPerSlide, 3)}, 1fr);
            gap: 1.5rem;
            flex-shrink: 0;
        `;
        
        const slideItems = items.slice(i * itemsPerSlide, (i + 1) * itemsPerSlide);
        slideItems.forEach(item => slide.appendChild(item));
        track.appendChild(slide);
    }
    
    wrapper.appendChild(track);
    
    // Show arrows
    const arrows = document.querySelector(`.${type}-arrows`);
    if (arrows) arrows.classList.add('show');
    
    // Initialize carousel controls
    let currentSlide = 0;
    
    function updateCarousel() {
        track.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;
        
        const prevBtn = document.getElementById(`${type}sPrev`);
        const nextBtn = document.getElementById(`${type}sNext`);
        
        if (prevBtn) {
            prevBtn.disabled = currentSlide === 0;
            prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentSlide === totalSlides - 1;
            nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
        }
    }
    
    // Add event listeners
    const prevBtn = document.getElementById(`${type}sPrev`);
    const nextBtn = document.getElementById(`${type}sNext`);
    
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.onclick = () => {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateCarousel();
            }
        };
    }
    
    updateCarousel();
}

// Mobile navigation
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Contact form
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        if (!submitBtn) return;
        
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        alert('Thank you! We will contact you soon.');
        form.reset();
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}
