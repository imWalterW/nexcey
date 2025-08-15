
// Helper to load JSON
async function loadJSON(path){ const r = await fetch(path); if(!r.ok) throw new Error(`Failed to load ${path}`); return r.json(); }

// Dynamic Google Font loader from theme.json
function injectGoogleFont(fontName){
  if(!fontName) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;600;700;800&display=swap`;
  document.head.appendChild(link);
  document.documentElement.style.setProperty('--font', `'${fontName}', Arial, sans-serif`);
}

// Header behavior
function initHeader(){
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if(window.scrollY > 12) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  });
  // Mobile nav
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Smooth anchors
function initSmoothAnchors(){
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Generic Carousel
function createCarousel(rootId, items, renderItem, visibleDesktop=4, visibleTablet=2, visibleMobile=1, autoPlayCfg={enabled:true, interval:4000, pauseOnHover:true, resumeAfterManualNavigation:true}){
  const wrap = document.getElementById(rootId + '-wrap');
  const grid = document.getElementById(rootId + '-grid');
  const carousel = document.getElementById(rootId + '-carousel');
  const track = document.getElementById(rootId + '-track');
  const prev = carousel?.querySelector('.prev');
  const next = carousel?.querySelector('.next');

  const computeVisible = () => {
    const w = window.innerWidth;
    if(w <= 640) return visibleMobile;
    if(w <= 991) return visibleTablet;
    return visibleDesktop;
  };

  const renderGrid = () => {
    grid.classList.add(`${rootId}-cards`);
    grid.innerHTML = items.map(renderItem).join('');
  };

  const renderCarousel = () => {
    carousel.style.display = 'block';
    track.innerHTML = items.map(i => `<div class="card carousel-card">${renderItem(i)}</div>`).join('');
  };

  const useGrid = items.length <= computeVisible();
  if(useGrid){
    grid.style.display = 'grid'; carousel.style.display = 'none'; renderGrid();
  }else{
    grid.style.display = 'none'; renderCarousel();
  }

  // Carousel logic
  if(carousel.style.display === 'block'){
    let index = 0;
    const maxIndex = Math.max(0, items.length - computeVisible());
    const scrollToIndex = (i) => {
      index = Math.max(0, Math.min(i, maxIndex));
      const card = track.querySelector('.carousel-card');
      if(!card) return;
      const cardWidth = card.getBoundingClientRect().width + 16; // including gap
      track.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    };

    prev.addEventListener('click', () => { scrollToIndex(index - 1); manualOverride(); });
    next.addEventListener('click', () => { scrollToIndex(index + 1); manualOverride(); });

    // Touch support
    let startX = 0;
    track.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchend', (e)=>{
      const dx = e.changedTouches[0].clientX - startX;
      if(Math.abs(dx) > 40){
        if(dx < 0) scrollToIndex(index + 1); else scrollToIndex(index - 1);
        manualOverride();
      }
    });

    // Auto-play
    let timer = null;
    const start = () => {
      if(!autoPlayCfg.enabled) return;
      stop();
      timer = setInterval(()=>{
        if(index >= maxIndex) index = -1;
        scrollToIndex(index + 1);
      }, autoPlayCfg.interval || 4000);
    };
    const stop = () => { if(timer){ clearInterval(timer); timer = null; } };
    const manualOverride = () => {
      stop();
      if(autoPlayCfg.resumeAfterManualNavigation) setTimeout(start, 3000);
    };
    if(autoPlayCfg.pauseOnHover){
      track.addEventListener('mouseenter', stop);
      track.addEventListener('mouseleave', start);
    }
    start();

    window.addEventListener('resize', ()=>{ /* re-render on resize for accuracy */
      // In a full app we'd re-evaluate layout. For simplicity, leave as-is.
    });
  }
}

// Renderers
function serviceCard(s){ return `
  <div class="service-card card">
    <div class="icon"><i class="${s.icon}"></i></div>
    <h3>${s.name}</h3>
    <p>${s.description}</p>
  </div>`;
}

function pricingCard(p){
  const features = (p.features||[]).map(f=>`<li>${f}</li>`).join('');
  const popularClass = p.popular ? 'popular' : '';
  const badge = p.popular ? `<span class="badge">${'Most Popular'}</span>` : '';
  return `
  <div class="pricing-card card ${popularClass}">
    ${badge}
    <h3>${p.name}</h3>
    <p class="price">${p.price}</p>
    <ul>${features}</ul>
    <a href="#contact" class="btn ${p.popular ? 'btn-white' : 'btn-primary'}">${(p.ctaButton && p.ctaButton.text) || 'Choose Plan'}</a>
  </div>`;
}

function clientCard(c){
  return `
  <div class="client-card card">
    <img class="logo" src="${c.logo}" alt="${c.name} logo" />
    <img class="site" src="${c.websiteImage}" alt="${c.name} website" />
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.6rem">
      <strong>${c.name}</strong>
      <a class="btn btn-primary" href="${c.websiteUrl}" target="_blank" rel="noopener">Visit</a>
    </div>
  </div>`;
}

function testimonialCard(t){
  const title = t.company ? `${t.name}, ${t.position} at ${t.company}` : `${t.name} — ${t.position}`;
  return `
  <div class="testimonial-card card">
    <div style="display:flex; align-items:center; gap:0.8rem; margin-bottom:0.6rem">
      <img class="avatar" src="${t.image}" alt="${t.name} photo" />
      <div><strong>${t.name}</strong><div style="font-size:0.9rem; color:var(--text-light)">${title}</div></div>
    </div>
    <p>"${t.comment}"</p>
  </div>`;
}

// Contact cards
function buildContactCards(data){
  const wrap = document.getElementById('contact-cards');
  const items = [
    {icon:'fa-solid fa-envelope', label: 'Email', value: data.email},
    {icon:'fa-solid fa-phone', label: 'Phone', value: data.phone},
    {icon:'fa-solid fa-map-marker-alt', label: 'Address', value: data.address}
  ];
  wrap.innerHTML = items.map(i => `
    <div class="contact-card card">
      <i class="${i.icon}"></i>
      <div><strong>${i.label}</strong><div>${i.value}</div></div>
    </div>
  `).join('');
}

// Form validation
function initForm(){
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e)=>{
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!name || !emailOk || !message){
      e.preventDefault();
      alert('Please fill in Name, a valid Email, and Message.');
    }else{
      // Let Netlify handle submission. Optionally show a friendly feedback.
      alert('Thanks! Your message has been sent.');
    }
  });
}

async function init(){
  try{
    // Theme
    const theme = await loadJSON('/data/theme.json');
    document.querySelector(':root').style.setProperty('--primary', theme.branding.palette.primary);
    document.querySelector(':root').style.setProperty('--primary-light', theme.branding.palette.primaryLight);
    document.querySelector(':root').style.setProperty('--primary-dark', theme.branding.palette.primaryDark);
    document.querySelector(':root').style.setProperty('--text-dark', theme.branding.palette.textDark);
    document.querySelector(':root').style.setProperty('--text-light', theme.branding.palette.textLight);
    document.querySelector(':root').style.setProperty('--body-size', theme.typography.bodySize || '15px');
    injectGoogleFont(theme.typography.googleFont);

    // Header logo
    const logo = document.querySelector('.logo');
    if(theme.branding.logo) logo.src = theme.branding.logo;
    const footerLogo = document.querySelector('.footer-logo');
    if(theme.branding.logo) footerLogo.src = theme.branding.logo;

    // HERO
    const hero = await loadJSON('/data/hero.json');
    const hTitle = document.getElementById('hero-title');
    const hSubtitle = document.getElementById('hero-subtitle');
    const hCta = document.getElementById('hero-cta');
    hTitle.textContent = hero.title;
    hTitle.style.fontSize = hero.titleSize || '3rem';
    hSubtitle.textContent = hero.subtitle;
    hSubtitle.style.fontSize = hero.subtitleSize || '1.2rem';
    hCta.textContent = hero.cta?.text || 'Get Started';
    hCta.href = hero.cta?.link || '#contact';

    // ABOUT
    const about = await loadJSON('/data/about.json');
    document.getElementById('about-title').textContent = about.title;
    document.getElementById('about-text').textContent = about.text;
    const aboutImg = document.getElementById('about-image');
    aboutImg.src = about.image;
    aboutImg.style.borderRadius = (about.imageSettings?.borderRadius || 10) + 'px';

    // SERVICES
    const services = await loadJSON('/data/services.json');
    document.querySelector('#services .section-title').textContent = services.title;
    createCarousel('services', services.services, serviceCard, 4, 2, 1, services.autoPlay || {});

    // PRICING
    const pricing = await loadJSON('/data/pricing.json');
    document.querySelector('#pricing .section-title').textContent = pricing.title;
    createCarousel('pricing', pricing.plans, pricingCard, 3, 2, 1, pricing.autoPlay || {});

    // CLIENTS
    const clients = await loadJSON('/data/clients.json');
    document.querySelector('#clients .section-title').textContent = clients.title;
    createCarousel('clients', clients.clients, clientCard, 3, 2, 1, clients.autoPlay || {});

    // TESTIMONIALS
    const testimonials = await loadJSON('/data/testimonials.json');
    document.querySelector('#testimonials .section-title').textContent = testimonials.title;
    createCarousel('testimonials', testimonials.testimonials, testimonialCard, 3, 2, 1, testimonials.autoPlay || {});

    // CONTACT
    const contact = await loadJSON('/data/contact.json');
    buildContactCards(contact);
    initForm();

    // Footer
    const footer = await loadJSON('/data/footer.json');
    const middle = document.getElementById('footer-middle');
    const right = document.getElementById('footer-right');
    const copyright = document.getElementById('copyright');
    // Middle contacts
    const list = document.createElement('ul');
    (footer.middleColumn.contactInfo || []).forEach(ci => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="${ci.icon}"></i> ${ci.value}`;
      list.appendChild(li);
    });
    middle.appendChild(list);
    // Social
    (footer.rightColumn.socialLinks || []).forEach(s => {
      const a = document.createElement('a'); a.href=s.url || '#'; a.target="_blank"; a.rel="noopener";
      a.innerHTML = `<i class="${s.icon}"></i>`; right.appendChild(a);
    });
    copyright.textContent = footer.copyrightText || `© ${new Date().getFullYear()} Nexcey. All rights reserved.`;

    // Init AOS
    AOS.init({ once:true, duration:700, easing:'ease' });

    // Init header and anchors
    initHeader();
    initSmoothAnchors();
  }catch(err){
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', init);
