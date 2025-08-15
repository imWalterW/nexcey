
// Smooth scrolling + mobile menu
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu');
  const burger = document.querySelector('.hamburger');
  burger?.addEventListener('click', () => menu.classList.toggle('open'));
  document.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));

  // AOS init if present
  if (window.AOS) AOS.init({ once: true, offset: 60, duration: 600, easing: 'ease' });

  // Load data with graceful fallback to embedded defaults
  loadAllDataAndRender();
});

async function safeFetchJSON(path){
  try{
    const res = await fetch(path);
    if(!res.ok) throw new Error('HTTP '+res.status);
    return await res.json();
  }catch(e){
    // Fallback to embedded script[type=application/json] or window.__DATA
    const id = path.split('/').pop().replace('.json','');
    const inline = document.getElementById('data-'+id);
    if(inline){
      return JSON.parse(inline.textContent);
    }
    if(window.__DATA && window.__DATA[id]) return window.__DATA[id];
    console.warn('Using empty fallback for', path);
    return {};
  }
}

async function loadAllDataAndRender(){
  const [theme, hero, about, services, pricing, clients, testimonials, footer] = await Promise.all([
    safeFetchJSON('data/theme.json'),
    safeFetchJSON('data/hero.json'),
    safeFetchJSON('data/about.json'),
    safeFetchJSON('data/services.json'),
    safeFetchJSON('data/pricing.json'),
    safeFetchJSON('data/clients.json'),
    safeFetchJSON('data/testimonials.json'),
    safeFetchJSON('data/footer.json')
  ]);
  applyTheme(theme);
  renderHero(hero);
  renderAbout(about);
  renderServices(services);
  renderPricing(pricing);
  renderClients(clients);
  renderTestimonials(testimonials);
  renderFooter(footer);
}

function applyTheme(theme){
  const p = theme?.palette || {};
  const root = document.documentElement;
  if(p.primary) root.style.setProperty('--primary', p.primary);
  if(p.primaryLight) root.style.setProperty('--primaryLight', p.primaryLight);
  if(p.primaryDark) root.style.setProperty('--primaryDark', p.primaryDark);
  if(p.secondary) root.style.setProperty('--secondary', p.secondary);
  if(p.textDark) root.style.setProperty('--textDark', p.textDark);
  if(p.textLight) root.style.setProperty('--textLight', p.textLight);
}

function renderHero(data){
  const el = document.getElementById('hero');
  if(!el) return;
  el.innerHTML = `
    <div class="container">
      <h1 data-aos="fade-up">${escapeHTML(data.title || '')}</h1>
      <p data-aos="fade-up" data-aos-delay="80">${escapeHTML(data.subtitle || '')}</p>
      <a href="${data.cta?.link || '#contact-us'}" class="btn" data-aos="fade-up" data-aos-delay="120">
        ${escapeHTML(data.cta?.text || 'Get Started')} <i class="fas fa-arrow-right"></i>
      </a>
    </div>
  `;
}

function renderAbout(data){
  const el = document.getElementById('about');
  if(!el) return;
  el.innerHTML = `
    <div class="container grid grid-2">
      <div class="col" data-aos="fade-right">
        <h2 class="section-title" style="text-align:left">${escapeHTML(data.title || '')}</h2>
        <p>${escapeHTML(data.text || '')}</p>
      </div>
      <div class="col" data-aos="fade-left">
        <img src="${data.image || 'assets/images/uploads/about.jpg'}" alt="About Nexcey">
      </div>
    </div>
  `;
}

function renderServices(data){
  const el = document.getElementById('services');
  if(!el) return;
  const items = (data.items || []).map(s => `
    <div class="card" data-aos="zoom-in">
      <i class="icon ${s.icon || 'fas fa-rocket'}"></i>
      <h3>${escapeHTML(s.name || '')}</h3>
      <p>${escapeHTML(s.description || '')}</p>
    </div>
  `);

  const isCarousel = items.length > 4;
  el.innerHTML = `
    <div class="container">
      <h2 class="section-title">${escapeHTML(data.title || 'Our Services')}</h2>
      ${isCarousel ? carouselHTML('services', items, 4) : `<div class="services-grid">${items.join('')}</div>`}
    </div>
  `;
  if(isCarousel) mountCarousel('services', {itemsPerSlide:4, autoplay:true, interval:4000, pauseOnHover:true});
}

function renderPricing(data){
  const el = document.getElementById('pricing');
  if(!el) return;
  const items = (data.plans||[]).map(plan=>{
    const feats = (plan.features||[]).map(f=>`<li><i class="fas fa-check"></i> ${escapeHTML(f)}</li>`).join('');
    return `
      <div class="card ${plan.popular?'popular':''}" data-aos="fade-up">
        ${plan.popular ? `<div class="badge" style="margin-bottom:.5rem;font-weight:700">Most Popular</div>`:''}
        <h3>${escapeHTML(plan.name||'')}</h3>
        <p style="font-size:2rem;margin:.2rem 0 1rem">${escapeHTML(plan.price||'')}</p>
        <ul style="list-style:none;padding:0;display:grid;gap:.4rem">${feats}</ul>
        <a href="#contact-us" class="btn btn-outline" style="margin-top:1rem">Choose Plan</a>
      </div>
    `;
  });

  const isCarousel = items.length > 3;
  el.innerHTML = `
    <div class="container pricing">
      <h2 class="section-title">${escapeHTML(data.title || 'Pricing Plans')}</h2>
      ${isCarousel ? carouselHTML('pricing', items, 3) : `<div class="grid" style="grid-template-columns:repeat(3,1fr)">${items.join('')}</div>`}
    </div>
  `;
  if(isCarousel) mountCarousel('pricing', {itemsPerSlide:3, autoplay:true, interval:4000, pauseOnHover:true});
}

function renderClients(data){
  const el = document.getElementById('clients');
  if(!el) return;
  const items = (data.items||[]).map(c=>`
    <div class="card" data-aos="fade-up">
      <div class="site-thumb"><img src="${c.websiteImage}" alt="${escapeHTML(c.name)} website"></div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:.8rem">
        <div style="display:flex;align-items:center;gap:.6rem">
          <img src="${c.logo}" alt="${escapeHTML(c.name)} logo" style="height:36px;width:auto">
          <strong>${escapeHTML(c.name)}</strong>
        </div>
        <a class="btn btn-outline" href="${c.websiteUrl}" target="_blank" rel="noopener">Visit</a>
      </div>
    </div>
  `);
  const isCarousel = items.length > 3;
  el.innerHTML = `
    <div class="container clients">
      <h2 class="section-title">${escapeHTML(data.title || 'Our Clients')}</h2>
      ${isCarousel ? carouselHTML('clients', items, 3) : `<div class="grid" style="grid-template-columns:repeat(3,1fr)">${items.join('')}</div>`}
    </div>
  `;
  if(isCarousel) mountCarousel('clients', {itemsPerSlide:3, autoplay:true, interval:4000, pauseOnHover:true});
}

function renderTestimonials(data){
  const el = document.getElementById('testimonials');
  if(!el) return;
  const items = (data.items||[]).map(t=>`
    <div class="card testimonial" data-aos="fade-up">
      <img src="${t.image}" alt="${escapeHTML(t.name)}">
      <div>
        <p style="margin:.2rem 0  .6rem">“${escapeHTML(t.comment)}”</p>
        <div style="font-weight:700">${escapeHTML(t.name)}</div>
        <div style="color:var(--textLight)">${escapeHTML(t.position)} ${t.company? ' · '+escapeHTML(t.company):''}</div>
      </div>
    </div>
  `);
  const isCarousel = items.length > 3;
  el.innerHTML = `
    <div class="container">
      <h2 class="section-title">${escapeHTML(data.title || 'What Our Clients Say')}</h2>
      ${isCarousel ? carouselHTML('testimonials', items, 3) : `<div class="grid" style="grid-template-columns:repeat(3,1fr)">${items.join('')}</div>`}
    </div>
  `;
  if(isCarousel) mountCarousel('testimonials', {itemsPerSlide:3, autoplay:true, interval:4000, pauseOnHover:true});
}

function renderFooter(data){
  const f = document.querySelector('footer .container');
  if(!f) return;
  f.innerHTML = `
    <div class="footer-grid">
      <div>
        <div class="brand"><img class="footer-logo" src="assets/images/logo.png" alt="Nexcey Logo"><span>Nexcey</span></div>
        <p style="margin-top:.6rem;color:#cfd3dc">We craft clean, modern websites that convert.</p>
      </div>
      <div>
        <div style="display:grid;gap:.6rem">
          <div class="mini" style="text-align:left;color:#cfd3dc"><i class="fas fa-envelope"></i> &nbsp; ${escapeHTML(data.email||'')}</div>
          <div class="mini" style="text-align:left;color:#cfd3dc"><i class="fas fa-phone"></i> &nbsp; ${escapeHTML(data.phone||'')}</div>
          <div class="mini" style="text-align:left;color:#cfd3dc"><i class="fas fa-map-marker-alt"></i> &nbsp; ${escapeHTML(data.address||'')}</div>
        </div>
      </div>
      <div>
        <div class="footer-social">
          ${socialLink('facebook', data.social?.facebook)}
          ${socialLink('x-twitter', data.social?.['x-twitter'])}
          ${socialLink('linkedin', data.social?.linkedin)}
          ${socialLink('instagram', data.social?.instagram)}
          ${socialLink('whatsapp', data.social?.whatsapp)}
        </div>
      </div>
    </div>
    <div class="mini">© 2024 Nexcey. All rights reserved.</div>
  `;
}

function socialLink(name, url){
  const map = {
    'facebook':'fab fa-facebook-f',
    'x-twitter':'fab fa-x-twitter',
    'linkedin':'fab fa-linkedin-in',
    'instagram':'fab fa-instagram',
    'whatsapp':'fab fa-whatsapp'
  };
  return `<a href="${url||'#'}" target="_blank" rel="noopener"><i class="${map[name]||'fas fa-link'}"></i></a>`;
}

function carouselHTML(id, items, per){
  return `
    <div class="carousel" id="carousel-${id}" data-per="${per}">
      <div class="carousel-track">
        ${items.map(i=>`<div class="card">${i}</div>`).join('')}
      </div>
      <div class="carousel-nav">
        <button class="carousel-btn prev" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
        <button class="carousel-btn next" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
      </div>
    </div>
  `;
}

function mountCarousel(id, opts){
  const root = document.getElementById('carousel-'+id);
  if(!root) return;
  const track = root.querySelector('.carousel-track');
  const prev = root.querySelector('.prev');
  const next = root.querySelector('.next');
  const per = parseInt(root.dataset.per || String(opts.itemsPerSlide||3),10);
  const cards = Array.from(track.children);
  let index = 0, timer = null;
  const maxIndex = Math.max(0, Math.ceil(cards.length / per) - 1);
  function update(){
    const width = root.clientWidth;
    const slideWidth = width;
    track.style.transform = `translateX(${-index*slideWidth}px)`;
    track.style.gridTemplateColumns = `repeat(${cards.length}, 1fr)`;
    track.style.width = `${(maxIndex+1)*100}%`;
  }
  function go(dir){
    index = (index + dir + (maxIndex+1)) % (maxIndex+1);
    update();
    if(opts.autoplay) restart();
  }
  prev.addEventListener('click', ()=>go(-1));
  next.addEventListener('click', ()=>go(1));
  window.addEventListener('resize', update);
  update();
  function start(){
    if(opts.autoplay){
      timer = setInterval(()=>go(1), opts.interval||4000);
      root.addEventListener('mouseenter', ()=>opts.pauseOnHover && clearInterval(timer));
      root.addEventListener('mouseleave', ()=>opts.pauseOnHover && start());
    }
  }
  function restart(){ if(timer){ clearInterval(timer); start(); } }
  start();
}

// Contact form validation
function validateEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
document.addEventListener('submit', (e)=>{
  const form = e.target.closest('#contact-form');
  if(!form) return;
  e.preventDefault();
  const name = form.querySelector('[name=name]').value.trim();
  const email = form.querySelector('[name=email]').value.trim();
  const phone = form.querySelector('[name=phone]').value.trim();
  const message = form.querySelector('[name=message]').value.trim();
  if(!name){ alert('Name is required'); return; }
  if(!email || !validateEmail(email)){ alert('Valid email is required'); return; }
  if(!message){ alert('Message is required'); return; }
  alert('Thanks! Your message has been sent (demo).');
  form.reset();
});

// Utils
function escapeHTML(s){ return (s||'').replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m])); }
