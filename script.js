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
    try {
        // Load Hero Content
        const heroResponse = await fetch('_data/hero.json');
        if (heroResponse.ok) {
            const heroData = await heroResponse.json();
            document.getElementById('hero-title').textContent = heroData.title;
            document.getElementById('hero-subtitle').textContent = heroData.subtitle;
            document.getElementById('hero-cta').textContent = heroData.ctaText;
            document.getElementById('hero-cta').href = heroData.ctaLink;
        }
    } catch (error) {
        console.log('Using default hero content');
    }

    try {
        // Load Services
        const servicesResponse = await fetch('_data/services.json');
        if (servicesResponse.ok) {
            const servicesData = await servicesResponse.json();
            const servicesGrid = document.getElementById('services-grid');
            
            const serviceIcons = ['🌐', '💼', '🏢', '🛒']; // Default icons
            
            servicesGrid.innerHTML = servicesData.items.map((service, index) => `
                <div class="service__card">
                    <div class="service__icon">${serviceIcons[index] || '💻'}</div>
                    <h3 class="service__title">${service}</h3>
                </div>
            `).join('');
        }
    } catch (error) {
        // Fallback services
        const servicesGrid = document.getElementById('services-grid');
        const defaultServices = ['Landing Pages', 'Portfolio Websites', 'Business Websites', 'E-commerce Websites'];
        const serviceIcons = ['🌐', '💼', '🏢', '🛒'];
        
        servicesGrid.innerHTML = defaultServices.map((service, index) => `
            <div class="service__card">
                <div class="service__icon">${serviceIcons[index]}</div>
                <h3 class="service__title">${service}</h3>
            </div>
        `).join('');
    }

    try {
        // Load Pricing
        const pricingResponse = await fetch('_data/pricing.json');
        if (pricingResponse.ok) {
            const pricingData = await pricingResponse.json();
            const pricingGrid = document.getElementById('pricing-grid');
            
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
    } catch (error) {
        // Fallback pricing
        const pricingGrid = document.getElementById('pricing-grid');
        const defaultPlans = [
            {
                name: "Starter Pack",
                price: "$200",
                features: [
                    "Single Page Website",
                    "Free 1 Year Domain & Hosting",
                    "1 Professional Email"
                ]
            },
            {
                name: "Gold Pack",
                price: "$350",
                features: [
                    "Up to 5 Pages",
                    "Free 1 Year Domain & Hosting",
                    "3 Professional Emails"
                ]
            },
            {
                name: "Platinum Pack",
                price: "$500",
                features: [
                    "Up to 10 Pages (Best for E-commerce)",
                    "Free 1 Year Domain & Hosting",
                    "5 Professional Emails"
                ]
            }
        ];
        
        pricingGrid.innerHTML = defaultPlans.map((plan, index) => `
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

    try {
        // Load Clients
        const clientsResponse = await fetch('_data/clients.json');
        if (clientsResponse.ok) {
            const clientsData = await clientsResponse.json();
            const clientsCarousel = document.getElementById('clients-carousel');
            
            clientsCarousel.innerHTML = clientsData.clients.map(client => `
                <div class="client__card">
                    <div class="client__logo">
                        <img src="${client.logo}" alt="${client.name}" onerror="this.style.display='none'">
                    </div>
                    <h4 class="client__name">${client.name}</h4>
                    <div class="client__website">
                        <img src="${client.websiteImage}" alt="${client.name} website" onerror="this.style.display='none'">
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        // Fallback clients
        const clientsCarousel = document.getElementById('clients-carousel');
        clientsCarousel.innerHTML = `
            <div class="client__card">
                <div class="client__logo">
                    <div style="width:80px;height:80px;background:var(--gradient);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">C1</div>
                </div>
                <h4 class="client__name">Sample Client 1</h4>
                <div class="client__website" style="background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#666;">Website Preview</div>
            </div>
            <div class="client__card">
                <div class="client__logo">
                    <div style="width:80px;height:80px;background:var(--gradient);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;">C2</div>
                </div>
                <h4 class="client__name">Sample Client 2</h4>
                <div class="client__website" style="background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#666;">Website Preview</div>
            </div>
        `;
    }

    try {
        // Load Testimonials
        const testimonialsResponse = await fetch('_data/testimonials.json');
        if (testimonialsResponse.ok) {
            const testimonialsData = await testimonialsResponse.json();
            const testimonialsCarousel = document.getElementById('testimonials-carousel');
            
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
        }
    } catch (error) {
        // Fallback testimonials
        const testimonialsCarousel = document.getElementById('testimonials-carousel');
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
        `;
    }

    try {
        // Load Footer
        const footerResponse = await fetch('_data/footer.json');
        if (footerResponse.ok) {
            const footerData = await footerResponse.json();
            document.getElementById('footer-email').textContent = footerData.email;
            document.getElementById('footer-phone').textContent = footerData.phone;
            document.getElementById('footer-address').textContent = footerData.address;
            
            const footerSocial = document.getElementById('footer-social');
            footerSocial.innerHTML = `
                ${footerData.social.facebook ? `<a href="${footerData.social.facebook}" class="footer__social-link" target="_blank"><i class="fab fa-facebook-f"></i></a>` : ''}
                ${footerData.social.x ? `<a href="${footerData.social.x}" class="footer__social-link" target="_blank"><i class="fab fa-x-twitter"></i></a>` : ''}
                ${footerData.social.instagram ? `<a href="${footerData.social.instagram}" class="footer__social-link" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                ${footerData.social.linkedin ? `<a href="${footerData.social.linkedin}" class="footer__social-link" target="_blank"><i class="fab fa-linkedin-in"></i></a>` : ''}
                ${footerData.social.whatsapp ? `<a href="${footerData.social.whatsapp}" class="footer__social-link" target="_blank"><i class="fab fa-whatsapp"></i></a>` : ''}
            `;
        }
    } catch (error) {
        // Use default footer content (already in HTML)
        const footerSocial = document.getElementById('footer-social');
        footerSocial.innerHTML = `
            <a href="#" class="footer__social-link"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="footer__social-link"><i class="fab fa-x-twitter"></i></a>
            <a href="#" class="footer__social-link"><i class="fab fa-instagram"></i></a>
            <a href="#" class="footer__social-link"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" class="footer__social-link"><i class="fab fa-whatsapp"></i></a>
        `;
    }
}

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Netlify handles the form submission
        // Add success feedback here if needed
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
