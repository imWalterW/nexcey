// ===== SHOW MENU =====
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

// Menu show
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Menu hidden
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// ===== REMOVE MENU MOBILE =====
const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));

// ===== SCROLL SECTIONS ACTIVE LINK =====
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
        } else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
        }
    });
}
window.addEventListener('scroll', scrollActive);

// ===== CHANGE BACKGROUND HEADER =====
function scrollHeader() {
    const nav = document.getElementById('header');
    if (this.scrollY >= 80) nav.classList.add('scroll-header');
    else nav.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);

// ===== SMOOTH SCROLLING =====
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

// ===== LOAD DYNAMIC CONTENT =====
async function loadContent() {
    // Load Hero Content
    try {
        const heroResponse = await fetch('_data/hero.json');
        if (heroResponse.ok) {
            const heroData = await heroResponse.json();
            const heroTitle = document.getElementById('hero-title');
            const heroSubtitle = document.getElementById('hero-subtitle');
            const heroCta = document.getElementById('hero-cta');
            
            if (heroTitle) heroTitle.textContent = heroData.title;
            if (heroSubtitle) heroSubtitle.textContent = heroData.subtitle;
            if (heroCta) {
                heroCta.textContent = heroData.ctaText;
                heroCta.href = heroData.ctaLink;
            }
        }
    } catch (error) {
        console.log('Using default hero content');
    }

    // Load Services
    try {
        const servicesResponse = await fetch('_data/services.json');
        if (servicesResponse.ok) {
            const servicesData = await servicesResponse.json();
            const servicesGrid = document.getElementById('services-grid');
            
            if (servicesGrid && servicesData.items) {
                servicesGrid.innerHTML = servicesData.items.map(service => `
                    <div class="service__card">
                        <div class="service__icon">
                            <i class="fas fa-${service.icon || 'laptop'}"></i>
                        </div>
                        <h3 class="service__title">${service.title}</h3>
                        <p class="service__description">${service.description || ''}</p>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.log('Loading fallback services');
        const servicesGrid = document.getElementById('services-grid');
        if (servicesGrid) {
            servicesGrid.innerHTML = `
                <div class="service__card">
                    <div class="service__icon">
                        <i class="fas fa-laptop"></i>
                    </div>
                    <h3 class="service__title">Landing Pages</h3>
                    <p class="service__description">High-converting single-page websites designed to capture leads and drive action.</p>
                </div>
                <div class="service__card">
                    <div class="service__icon">
                        <i class="fas fa-briefcase"></i>
                    </div>
                    <h3 class="service__title">Portfolio Websites</h3>
                    <p class="service__description">Showcase your work with stunning portfolio sites that highlight your expertise.</p>
                </div>
                <div class="service__card">
                    <div class="service__icon">
                        <i class="fas fa-building"></i>
                    </div>
                    <h3 class="service__title">Business Websites</h3>
                    <p class="service__description">Professional corporate websites that establish credibility and drive growth.</p>
                </div>
                <div class="service__card">
                    <div class="service__icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3 class="service__title">E-commerce Websites</h3>
                    <p class="service__description">Full-featured online stores with secure payment processing and inventory management.</p>
                </div>
            `;
        }
    }

    // Load Pricing
    try {
        const pricingResponse = await fetch('_data/pricing.json');
        if (pricingResponse.ok) {
            const pricingData = await pricingResponse.json();
            const pricingGrid = document.getElementById('pricing-grid');
            
            if (pricingGrid && pricingData.plans) {
                pricingGrid.innerHTML = pricingData.plans.map((plan, index) => `
                    <div class="pricing__card ${index === 1 ? 'featured' : ''}">
                        <h3 class="pricing__name">${plan.name}</h3>
                        <div class="pricing__price">${plan.price}</div>
                        <ul class="pricing__features">
                            ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        <a href="#contact-us" class="button">Choose Plan</a>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.log('Loading fallback pricing');
        const pricingGrid = document.getElementById('pricing-grid');
        if (pricingGrid) {
            pricingGrid.innerHTML = `
                <div class="pricing__card">
                    <h3 class="pricing__name">Starter Pack</h3>
                    <div class="pricing__price">$200</div>
                    <ul class="pricing__features">
                        <li>Single Page Website</li>
                        <li>Free 1 Year Domain & Hosting</li>
                        <li>1 Professional Email</li>
                    </ul>
                    <a href="#contact-us" class="button">Choose Plan</a>
                </div>
                <div class="pricing__card featured">
                    <h3 class="pricing__name">Gold Pack</h3>
                    <div class="pricing__price">$350</div>
                    <ul class="pricing__features">
                        <li>Up to 5 Pages</li>
                        <li>Free 1 Year Domain & Hosting</li>
                        <li>3 Professional Emails</li>
                    </ul>
                    <a href="#contact-us" class="button">Choose Plan</a>
                </div>
                <div class="pricing__card">
                    <h3 class="pricing__name">Platinum Pack</h3>
                    <div class="pricing__price">$500</div>
                    <ul class="pricing__features">
                        <li>Up to 10 Pages (Best for E-commerce)</li>
                        <li>Free 1 Year Domain & Hosting</li>
                        <li>5 Professional Emails</li>
                    </ul>
                    <a href="#contact-us" class="button">Choose Plan</a>
                </div>
            `;
        }
    }

    // Load Clients
    try {
        const clientsResponse = await fetch('_data/clients.json');
        if (clientsResponse.ok) {
            const clientsData = await clientsResponse.json();
            const clientsCarousel = document.getElementById('clients-carousel');
            
            if (clientsCarousel && clientsData.clients) {
                clientsCarousel.innerHTML = clientsData.clients.map(client => `
                    <div class="client__card">
                        <div class="client__logo">
                            ${client.logo && client.logo.trim() !== '' 
                                ? `<img src="${client.logo}" alt="${client.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                   <div style="width:80px;height:80px;background:var(--gradient);border-radius:50%;display:none;align-items:center;justify-content:center;color:white;font-size:1.5rem;">${client.name.charAt(0)}</div>`
                                : `<div style="width:80px;height:80px;background:var(--gradient);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">${client.name.charAt(0)}</div>`
                            }
                        </div>
                        <h4 class="client__name">${client.name}</h4>
                        <div class="client__website">
                            ${client.websiteImage && client.websiteImage.trim() !== ''
                                ? `<img src="${client.websiteImage}" alt="${client.name} website" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                   <div style="background:#f0f0f0;display:none;align-items:center;justify-content:center;color:#666;height:100%;">Website Preview</div>`
                                : `<div style="background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#666;height:100%;">Website Preview</div>`
                            }
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.log('Loading fallback clients');
        const clientsCarousel = document.getElementById('clients-carousel');
        if (clientsCarousel) {
            clientsCarousel.innerHTML = `
                <div class="client__card">
                    <div class="client__logo">
                        <div style="width:80px;height:80px;background:var(--gradient);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">T</div>
                    </div>
                    <h4 class="client__name">Tech Startup Inc</h4>
                    <div class="client__website" style="background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#666;">Website Preview</div>
                </div>
                <div class="client__card">
                    <div class="client__logo">
                        <div style="width:80px;height:80px;background:var(--gradient);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">F</div>
                    </div>
                    <h4 class="client__name">Fashion Boutique</h4>
                    <div class="client__website" style="background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#666;">Website Preview</div>
                </div>
                <div class="client__card">
                    <div class="client__logo">
                        <div style="width:80px;height:80px;background:var(--gradient);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">R</div>
                    </div>
                    <h4 class="client__name">Restaurant Chain</h4>
                    <div class="client__website" style="background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#666;">Website Preview</div>
                </div>
            `;
        }
    }

    // Load Testimonials (using same logic as clients)
    const testimonialsCarousel = document.getElementById('testimonials-carousel');
    try {
        const testimonialsResponse = await fetch('_data/testimonials.json');
        if (testimonialsResponse.ok) {
            const testimonialsData = await testimonialsResponse.json();
            
            if (testimonialsCarousel && testimonialsData.testimonials) {
                testimonialsCarousel.innerHTML = testimonialsData.testimonials.map(testimonial => `
                    <div class="testimonial__card">
                        <div class="testimonial__image">
                            ${testimonial.image && testimonial.image.trim() !== '' 
                                ? `<img src="${testimonial.image}" alt="${testimonial.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                   <div style="width:60px;height:60px;background:var(--gradient);border-radius:50%;display:none;align-items:center;justify-content:center;color:white;font-size:1.5rem;">👤</div>`
                                : `<div style="width:60px;height:60px;background:var(--gradient);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">👤</div>`
                            }
                        </div>
                        <h4 class="testimonial__name">${testimonial.name}</h4>
                        <p class="testimonial__comment">${testimonial.comment}</p>
                    </div>
                `).join('');
                console.log('Testimonials loaded successfully:', testimonialsData.testimonials.length);
            }
        }
    } catch (error) {
        console.log('Loading fallback testimonials');
        if (testimonialsCarousel) {
            testimonialsCarousel.innerHTML = `
                <div class="testimonial__card">
                    <div class="testimonial__image">
                        <div style="width:60px;height:60px;background:var(--gradient);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">👤</div>
                    </div>
                    <h4 class="testimonial__name">John Doe</h4>
                    <p class="testimonial__comment">Nexcey created an amazing website for my business. The design is modern and the service was exceptional!</p>
                </div>
                <div class="testimonial__card">
                    <div class="testimonial__image">
                        <div style="width:60px;height:60px;background:var(--gradient);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">👤</div>
                    </div>
                    <h4 class="testimonial__name">Jane Smith</h4>
                    <p class="testimonial__comment">Professional, creative, and delivered on time. I highly recommend Nexcey for web design services.</p>
                </div>
                <div class="testimonial__card">
                    <div class="testimonial__image">
                        <div style="width:60px;height:60px;background:var(--gradient);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">👤</div>
                    </div>
                    <h4 class="testimonial__name">Mike Johnson</h4>
                    <p class="testimonial__comment">The team at Nexcey understood our vision perfectly and delivered beyond our expectations.</p>
                    </div>
                </div>
            `;
            console.log('Fallback testimonials loaded');
        }
    }

    // Load Footer
    try {
        const footerResponse = await fetch('_data/footer.json');
        if (footerResponse.ok) {
            const footerData = await footerResponse.json();
            const footerEmail = document.getElementById('footer-email');
            const footerPhone = document.getElementById('footer-phone');
            const footerAddress = document.getElementById('footer-address');
            const footerSocial = document.getElementById('footer-social');
            
            if (footerEmail) footerEmail.textContent = footerData.email;
            if (footerPhone) footerPhone.textContent = footerData.phone;
            if (footerAddress) footerAddress.textContent = footerData.address;
            
            if (footerSocial) {
                footerSocial.innerHTML = `
                    ${footerData.social.facebook ? `<a href="${footerData.social.facebook}" class="footer__social-link" target="_blank"><i class="fab fa-facebook-f"></i></a>` : ''}
                    ${footerData.social.x ? `<a href="${footerData.social.x}" class="footer__social-link" target="_blank"><i class="fab fa-x-twitter"></i></a>` : ''}
                    ${footerData.social.instagram ? `<a href="${footerData.social.instagram}" class="footer__social-link" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                    ${footerData.social.linkedin ? `<a href="${footerData.social.linkedin}" class="footer__social-link" target="_blank"><i class="fab fa-linkedin-in"></i></a>` : ''}
                    ${footerData.social.whatsapp ? `<a href="${footerData.social.whatsapp}" class="footer__social-link" target="_blank"><i class="fab fa-whatsapp"></i></a>` : ''}
                `;
            }
        }
    } catch (error) {
        console.log('Using default footer content');
        const footerSocial = document.getElementById('footer-social');
        if (footerSocial) {
            footerSocial.innerHTML = `
                <a href="#" class="footer__social-link"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="footer__social-link"><i class="fab fa-x-twitter"></i></a>
                <a href="#" class="footer__social-link"><i class="fab fa-instagram"></i></a>
                <a href="#" class="footer__social-link"><i class="fab fa-linkedin-in"></i></a>
                <a href="#" class="footer__social-link"><i class="fab fa-whatsapp"></i></a>
            `;
        }
    }
}

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Netlify handles the form submission
        console.log('Form submitted to Netlify');
    });
}

// ===== SCROLL REVEAL ANIMATION =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.service__card, .pricing__card, .client__card, .testimonial__card');
    
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('reveal');
        } else {
            reveals[i].classList.remove('reveal');
        }
    }
}

window.addEventListener('scroll', revealOnScroll);

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing content...');
    loadContent();
    
    // Add CSS for reveal animation
    const style = document.createElement('style');
    style.textContent = `
        .service__card, .pricing__card, .client__card, .testimonial__card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        .service__card.reveal, .pricing__card.reveal, .client__card.reveal, .testimonial__card.reveal {
            opacity: 1;
            transform: translateY(0);
        }
        .active-link {
            color: var(--primary-color) !important;
        }
        .active-link::after {
            width: 100% !important;
        }
        .scroll-header {
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
});
