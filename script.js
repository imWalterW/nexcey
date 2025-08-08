document.addEventListener('DOMContentLoaded', () => {
    // Function to load JSON data
    const loadJSON = async (file) => {
        const response = await fetch(`_data/${file}`);
        return response.json();
    };

    // Function to update content
    const updateContent = async () => {
        // Hero Section
        const heroData = await loadJSON('hero.json');
        document.getElementById('hero-title').textContent = heroData.title;
        document.getElementById('hero-subtitle').textContent = heroData.subtitle;
        const ctaButton = document.getElementById('hero-cta');
        ctaButton.textContent = heroData.ctaText;
        ctaButton.href = heroData.ctaLink;

        // About Us Section
        document.getElementById('about-us-title').textContent = 'About Nexcey';
        document.getElementById('about-us-text').textContent = 'Nexcey is a modern web design studio offering tailor-made website solutions. From stunning landing pages to powerful e-commerce sites, we bring your ideas to life with clean, functional, and engaging designs.';

        // Services Section
        const servicesData = await loadJSON('services.json');
        document.getElementById('services-title').textContent = 'Our Services';
        const servicesList = document.getElementById('services-list');
        servicesData.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            servicesList.appendChild(li);
        });

        // Pricing Section
        const pricingData = await loadJSON('pricing.json');
        document.getElementById('pricing-title').textContent = 'Pricing Plans';
        const pricingCardsContainer = document.getElementById('pricing-cards-container');
        pricingData.plans.forEach(plan => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${plan.name}</h3>
                <p class="price">${plan.price}</p>
                <ul>
                    ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <a href="#contact-us" class="cta-button">Select Plan</a>
            `;
            pricingCardsContainer.appendChild(card);
        });

        // Clients Section (Placeholder for dynamic content)
        document.getElementById('clients-title').textContent = 'Our Clients';
        const clientsData = await loadJSON('clients.json');
        const clientsCarousel = document.getElementById('clients-carousel');
        clientsData.clients.forEach(client => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.innerHTML = `
                <img src="${client.logo}" alt="${client.name} Logo">
                <img src="${client.websiteImage}" alt="${client.name} Website Screenshot">
            `;
            clientsCarousel.appendChild(item);
        });
        
        // Testimonials Section (Placeholder for dynamic content)
        document.getElementById('testimonials-title').textContent = 'What Our Clients Say';
        const testimonialsData = await loadJSON('testimonials.json');
        const testimonialsCarousel = document.getElementById('testimonials-carousel');
        testimonialsData.testimonials.forEach(testimonial => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.innerHTML = `
                <img src="${testimonial.image}" alt="${testimonial.name}">
                <p>"${testimonial.comment}"</p>
                <h4>- ${testimonial.name}</h4>
            `;
            testimonialsCarousel.appendChild(item);
        });

        // Contact Section
        document.getElementById('contact-title').textContent = 'Contact Us';

        // Footer Section
        const footerData = await loadJSON('footer.json');
        const contactInfoDiv = document.getElementById('footer-contact-info');
        contactInfoDiv.innerHTML = `
            <p>Email: ${footerData.email}</p>
            <p>Phone: ${footerData.phone}</p>
            <p>Address: ${footerData.address}</p>
        `;

        const socialLinksDiv = document.getElementById('footer-social-links');
        socialLinksDiv.innerHTML = `
            ${footerData.social.facebook ? `<a href="${footerData.social.facebook}" target="_blank"><i class="fab fa-facebook-f"></i></a>` : ''}
            ${footerData.social.x ? `<a href="${footerData.social.x}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
            ${footerData.social.instagram ? `<a href="${footerData.social.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
            ${footerData.social.linkedin ? `<a href="${footerData.social.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>` : ''}
            ${footerData.social.whatsapp ? `<a href="https://wa.me/${footerData.social.whatsapp}" target="_blank"><i class="fab fa-whatsapp"></i></a>` : ''}
        `;
    };

    updateContent();

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Netlify CMS identity widget
    if (window.netlifyIdentity) {
        window.netlifyIdentity.on("init", user => {
            if (!user) {
                window.netlifyIdentity.on("login", () => {
                    document.location.href = "/admin/";
                });
            }
        });
    }
});