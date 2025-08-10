// Simple, working JavaScript - no overcomplicated BS
let servicesData = [];
let pricingData = [];
let clientsData = [];
let testimonialsData = [];

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    // Load all data
    loadAllData();
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize header scroll effect
    initHeaderScroll();
});

// Load all data
async function loadAllData() {
    try {
        await loadTheme();
        await loadHeroData();
        await loadAboutData();
        await loadServicesData();
        await loadPricingData();
        await loadClientsData();
        await loadTestimonialsData();
        await loadFooterData();
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
        if (theme.logo) {
            document.getElementById('headerLogo').src = theme.logo;
            document.getElementById('footerLogo').src = theme.logo;
        }
    } catch (error) {
        console.error('Error loading theme:', error);
    }
}

// Load hero data
async function loadHeroData() {
    try {
        const response = await fetch('_data/hero.json');
        const hero = await response.json();
        
        document.getElementById('heroTitle').textContent = hero.title;
        document.getElementById('heroSubtitle').textContent = hero.subtitle;
        document.getElementById('heroCtaText').textContent = hero.ctaText;
        document.getElementById('heroCtaButton').href = hero.ctaLink;
    } catch (error) {
        console.error('Error loading hero:', error);
    }
}

// Load about data
async function loadAboutData() {
    try {
        const response = await fetch('_data/about.json');
        const about = await response.json();
        
        document.getElementById('aboutTitle').textContent = about.title;
        document.getElementById('aboutText').textContent = about.text;
        if (about.image) {
            document.getElementById('aboutImage').src = about.image;
        }
    } catch (error) {
        console.error('Error loading about:', error);
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
        console.error('Error loading services:', error);
    }
}

// Render services - SIMPLE
function renderServices() {
    const wrapper = document.getElementById('servicesWrapper');
    wrapper.innerHTML = '';
    
    servicesData.forEach((service, index) => {
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
    
    // If more than 4 services, initialize carousel
    if (servicesData.length > 4) {
        initSimpleCarousel('services', 4);
    }
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
        console.error('Error loading pricing:', error);
    }
}

// Render pricing - SIMPLE
function renderPricing() {
    const wrapper = document.getElementById('pricingWrapper');
    wrapper.innerHTML = '';
    
    pricingData.forEach((plan, index) => {
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
        `;
        
        wrapper.appendChild(card);
    });
    
    // If more than 3 plans, initialize carousel
    if (pricingData.length > 3) {
        initSimpleCarousel('pricing', 3);
    }
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
        console.error('Error loading clients:', error);
    }
}

// Render clients - SIMPLE
function renderClients() {
    const wrapper = document.getElementById('clientsWrapper');
    wrapper.innerHTML = '';
    
    clientsData.forEach((client, index) => {
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
    
    // If more than 3 clients, initialize carousel
    if (clientsData.length > 3) {
        initSimpleCarousel('clients', 3);
    }
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
        console.error('Error loading testimonials:', error);
    }
}

// Render testimonials - SIMPLE
function renderTestimonials() {
    const wrapper = document.getElementById('testimonialsWrapper');
    wrapper.innerHTML = '';
    
    testimonialsData.forEach((testimonial, index) => {
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
    
    // If more than 3 testimonials, initialize carousel
    if (testimonialsData.length > 3) {
        initSimpleCarousel('testimonials', 3);
    }
}

// Load footer data
async function loadFooterData() {
    try {
        const response = await fetch('_data/footer.json');
        const footer = await response.json();
        
        document.getElementById('footerEmail').textContent = footer.email;
        document.getElementById('footerPhone').textContent = footer.phone;
        document.getElementById('footerAddress').textContent = footer.address;
        document.getElementById('contactEmail').textContent = footer.email;
        document.getElementById('contactPhone').textContent = footer.phone;
        document.getElementById('contactAddress').textContent = footer.address;
        
        // Set social links
        if (footer.social.facebook) document.getElementById('socialFacebook').href = footer.social.facebook;
        if (footer.social.x) document.getElementById('socialX').href = footer.social.x;
        if (footer.social.linkedin) document.getElementById('socialLinkedin').href = footer.social.linkedin;
        if (footer.social.instagram) document.getElementById('socialInstagram').href = footer.social.instagram;
        if (footer.social.whatsapp) document.getElementById('socialWhatsapp').href = footer.social.whatsapp;
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Simple carousel that actually works
function initSimpleCarousel(type, itemsPerSlide) {
    const wrapper = document.getElementById(`${type}sWrapper`);
    const items = wrapper.children;
    const totalItems = items.length;
    
    if (totalItems <= itemsPerSlide) return;
    
    // Create carousel structure
    wrapper.className = 'carousel-wrapper';
    const container = document.createElement('div');
    container.className = 'carousel-container';
    container.style.overflow = 'hidden';
    
    // Move all items into container
    while (wrapper.firstChild) {
        container.appendChild(wrapper.firstChild);
    }
    wrapper.appendChild(container);
    
    // Set container width
    const totalSlides = Math.ceil(totalItems / itemsPerSlide);
    container.style.width = `${totalSlides * 100}%`;
    container.style.display = 'flex';
    container.style.transition = 'transform 0.5s ease';
    
    // Set item widths
    Array.from(container.children).forEach(item => {
        item.style.width = `${100 / totalSlides}%`;
        item.style.flex = 'none';
    });
    
    let currentSlide = 0;
    let autoInterval;
    
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        container.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;
        
        // Update arrows
        const prevBtn = document.getElementById(`${type}sPrev`);
        const nextBtn = document.getElementById(`${type}sNext`);
        
        if (prevBtn && nextBtn) {
            prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
        }
    }
    
    function nextSlide() {
        currentSlide = currentSlide >= totalSlides - 1 ? 0 : currentSlide + 1;
        goToSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = currentSlide <= 0 ? totalSlides - 1 : currentSlide - 1;
        goToSlide(currentSlide);
    }
    
    function startAuto() {
        stopAuto();
        autoInterval = setInterval(nextSlide, 4000);
    }
    
    function stopAuto() {
        if (autoInterval) clearInterval(autoInterval);
    }
    
    // Add arrow event listeners
    const prevBtn = document.getElementById(`${type}sPrev`);
    const nextBtn = document.getElementById(`${type}sNext`);
    
    if (prevBtn && nextBtn) {
        document.querySelector(`.${type}-arrows`).classList.add('show');
        
        prevBtn.onclick = (e) => {
            e.preventDefault();
            stopAuto();
            prevSlide();
            startAuto();
        };
        
        nextBtn.onclick = (e) => {
            e.preventDefault();
            stopAuto();
            nextSlide();
            startAuto();
        };
    }
    
    // Pause on hover
    container.onmouseenter = stopAuto;
    container.onmouseleave = startAuto;
    
    // Touch support
    let startX = 0;
    container.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        stopAuto();
    });
    
    container.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        startAuto();
    });
    
    // Initialize
    goToSlide(0);
    startAuto();
}

// Mobile navigation
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Contact form
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate sending
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
