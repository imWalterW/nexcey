/* ---------- Helpers & Data Loading ---------- */
const isFileProtocol = location.protocol === 'file:';
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

async function loadJSON(path) {
  if (isFileProtocol) return null; // will use seed
  try {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error('Fetch failed: ' + path);
    return await res.json();
  } catch (e) {
    console.warn('Falling back to seed for', path, e);
    return null;
  }
}

function getSeed() {
  try {
    return JSON.parse($('#seed-data')?.textContent || '{}');
  } catch { return {}; }
}

/* ---------- Apply Theme ---------- */
function applyTheme(theme) {
  if (!theme) return;
  document.documentElement.style.setProperty('--primary', theme.primary || '#522cb5');
  document.documentElement.style.setProperty('--primary-light', theme.primaryLight || '#7c52d6');
  document.documentElement.style.setProperty('--primary-dark', theme.primaryDark || '#3d2088');
  document.documentElement.style.setProperty('--secondary', theme.secondary || '#f8f9fa');
  document.documentElement.style.setProperty('--text', theme.textDark || '#2c3e50');
  document.documentElement.style.setProperty('--text-light', theme.textLight || '#6c757d');

  if (theme.typography?.googleFont) {
    const f = theme.typography.googleFont.replace(/\s+/g, '+') + ':wght@400;600;800';
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${f}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    document.body.style.fontFamily = `${theme.typography.googleFont}, Arial, sans-serif`;
  }
  if (theme.typography?.bodyFontSize) {
    document.body.style.fontSize = theme.typography.bodyFontSize;
  }
}

/* ---------- Renderers ---------- */
function renderHero(data) {
  if (!data) return;
  $('#hero-title').textContent = data.title || '';
  $('#hero-subtitle').textContent = data.subtitle || '';
  const cta = $('#hero-cta');
  if (data.cta?.text) cta.textContent = data.cta.text;
  if (data.cta?.link) cta.href = data.cta.link;
}

function renderAbout(data) {
  if (!data) return;
  $('#about-title').textContent = data.title || '';
  $('#about-text').textContent = data.text || '';
  if (data.image) $('#about-image').src = data.image;
}

function serviceItemTpl(s) {
  return `
    <div class="carousel-item">
      <div class="service-card">
        <i class="${s.icon || 'fas fa-rocket'}" aria-hidden="true"></i>
        <h3>${s.name || ''}</h3>
        <p>${s.description || ''}</p>
      </div>
    </div>`;
}

function planItemTpl(p) {
  const popular = p.popular ? ' popular' : '';
  const feats = (p.features || []).map(f => `<li>${(f.feature || f)}</li>`).join('');
  return `
    <div class="carousel-item">
      <div class="price-card${popular}">
        <div class="name"><strong>${p.name || ''}</strong></div>
        <div class="price">${p.price || ''}</div>
        <ul>${feats}</ul>
        <button class="btn ${p.popular ? 'btn-white' : 'btn-primary'}">Choose Plan</button>
      </div>
    </div>`;
}

function clientItemTpl(c) {
  const logo = c.logo || c.websiteImage || 'assets/images/uploads/logo-placeholder.png';
  return `
    <div class="carousel-item">
      <div class="client-card">
        <img src="${logo}" alt="${c.name || 'Client'}" />
        <div class="name">${c.name || ''}</div>
        ${c.websiteUrl ? `<a class="btn btn-primary" href="${c.websiteUrl}" target="_blank" rel="noopener">Visit Website</a>` : ''}
      </div>
    </div>`;
}

function testimonialItemTpl(t) {
  const img = t.image || 'assets/images/uploads/user-placeholder.jpg';
  const who = [t.name, t.position, t.company].filter(Boolean).join(' · ');
  return `
    <div class="carousel-item">
      <div class="testimonial-card">
        <div class="testimonial-top">
          <img src="${img}" alt="${t.name || 'User'}" />
          <div class="meta">
            <div><strong>${t.name || ''}</strong></div>
            <small>${[t.position, t.company].filter(Boolean).join(' · ')}</small>
          </div>
        </div>
        <p>“${t.comment || ''}”</p>
      </div>
    </div>`;
}

/* ---------- Carousel (one-by-one, responsive) ---------- */
class OneByOneCarousel {
  constructor(root) {
    this.root = root;
    this.track = $('.carousel-track', root);
    this.prevBtn = $('.carousel-btn.prev', root);
    this.nextBtn = $('.carousel-btn.next', root);
    this.autoplayMs = parseInt(root.dataset.autoplay || '0', 10) || 0;

    this.visibleDesktop = parseInt(root.dataset.visibleDesktop || '4', 10);
    this.visibleTablet = parseInt(root.dataset.visibleTablet || '2', 10);
    this.visibleMobile = parseInt(root.dataset.visibleMobile || '1', 10);

    this.items = [];
    this.clonesHead = 0;
    this.clonesTail = 0;
    this.index = 0;
    this.itemWidth = 0;
    this.timer = null;

    this.onResize = this.onResize.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
  }

  get visibleCount() {
    const w = window.innerWidth;
    if (w < 768) return this.visibleMobile;
    if (w < 1200) return this.visibleTablet;
    return this.visibleDesktop;
  }

  mount() {
    this.items = $$('.carousel-item', this.track);
    if (this.items.length === 0) return;

    // Remove any previous clones
    this.track.innerHTML = '';
    const originals = this.items.map(n => n);
    // Determine visible
    const vis = this.visibleCount;

    // Clone head/tail for infinite effect
    const headClones = originals.slice(0, vis).map(n => n.cloneNode(true));
    const tailClones = originals.slice(-vis).map(n => n.cloneNode(true));

    this.clonesHead = headClones.length;
    this.clonesTail = tailClones.length;

    // Append: tail clones + originals + head clones
    tailClones.forEach(n => this.track.appendChild(n));
    originals.forEach(n => this.track.appendChild(n));
    headClones.forEach(n => this.track.appendChild(n));

    this.items = $$('.carousel-item', this.track);
    this.index = this.clonesTail; // start at first real item
    this.applySizes();
    this.goTo(this.index, false);

    // Events
    window.addEventListener('resize', this.onResize, { passive:true });
    this.track.addEventListener('transitionend', this.onTransitionEnd);
    this.prevBtn.addEventListener('click', this.prev);
    this.nextBtn.addEventListener('click', this.next);
    this.root.addEventListener('mouseenter', this.onMouseEnter);
    this.root.addEventListener('mouseleave', this.onMouseLeave);

    // Touch
    this.root.addEventListener('touchstart', this.onTouchStart, { passive:true });

    // Autoplay
    if (this.autoplayMs && this.items.length > this.visibleCount) {
      this.startAutoplay();
    }

    // Hide controls if not needed
    const total = this.items.length - (this.clonesHead + this.clonesTail);
    const visNow = this.visibleCount;
    const controls = $('.carousel-controls', this.root);
    controls.style.display = total <= visNow ? 'none' : 'flex';
  }

  applySizes() {
    const vis = this.visibleCount;
    const gap = parseFloat(getComputedStyle(this.track).columnGap || 18) || 18;
    const trackWidth = this.root.clientWidth;
    this.itemWidth = Math.floor((trackWidth - (gap * (vis - 1))) / vis);
    this.items.forEach(it => {
      it.style.flex = `0 0 ${this.itemWidth}px`;
      it.style.maxWidth = `${this.itemWidth}px`;
    });
  }

  onResize() {
    // Rebuild completely to update clones for new visible count
    this.unmount();
    this.mount();
  }

  goTo(i, animate=true) {
    this.track.style.transition = animate ? 'transform .4s ease' : 'none';
    const x = -i * (this.itemWidth + 18); // 18px gap set in CSS
    this.track.style.transform = `translate3d(${x}px,0,0)`;
    this.index = i;
  }

  next() {
    this.stopAutoplay(true);
    this.goTo(this.index + 1, true);
  }

  prev() {
    this.stopAutoplay(true);
    this.goTo(this.index - 1, true);
  }

  onTransitionEnd() {
    const vis = this.visibleCount;
    const total = this.items.length;
    const firstReal = this.clonesTail;
    const lastReal = total - this.clonesHead - 1;

    if (this.index > lastReal) {
      this.goTo(firstReal, false);
    }
    if (this.index < firstReal) {
      this.goTo(lastReal, false);
    }
  }

  startAutoplay() {
    this.stopAutoplay();
    this.timer = setInterval(() => this.goTo(this.index + 1, true), this.autoplayMs);
  }

  stopAutoplay(manual=false) {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (manual && this.autoplayMs) {
      // resume after manual navigation
      setTimeout(() => this.startAutoplay(), this.autoplayMs + 500);
    }
  }

  onMouseEnter(){ this.stopAutoplay(); }
  onMouseLeave(){ if (this.autoplayMs) this.startAutoplay(); }

  onTouchStart(e){
    const startX = e.touches[0].clientX;
    const startTime = Date.now();
    const move = (ev)=>{
      // noop; no dragging for simplicity
    };
    const end = (ev)=>{
      const dx = (ev.changedTouches?.[0]?.clientX || 0) - startX;
      const dt = Date.now() - startTime;
      const threshold = 30; // small flick
      if (Math.abs(dx) > threshold || dt < 200) {
        dx < 0 ? this.next() : this.prev();
      }
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);
    };
    window.addEventListener('touchmove', move, { passive:true });
    window.addEventListener('touchend', end, { passive:true });
  }

  unmount(){
    window.removeEventListener('resize', this.onResize);
    this.track.removeEventListener('transitionend', this.onTransitionEnd);
    this.prevBtn.removeEventListener('click', this.prev);
    this.nextBtn.removeEventListener('click', this.next);
    this.root.removeEventListener('mouseenter', this.onMouseEnter);
    this.root.removeEventListener('mouseleave', this.onMouseLeave);
    this.root.removeEventListener('touchstart', this.onTouchStart);
  }
}

/* ---------- Build Lists ---------- */
function populateServices(services) {
  const track = $('#services .carousel-track');
  track.innerHTML = '';
  services.items.forEach(s => track.insertAdjacentHTML('beforeend', serviceItemTpl(s)));
  new OneByOneCarousel($('#services .carousel')).mount();
}

function populatePricing(pricing) {
  const track = $('#pricing .carousel-track');
  track.innerHTML = '';
  pricing.plans.forEach(p => track.insertAdjacentHTML('beforeend', planItemTpl(p)));
  new OneByOneCarousel($('#pricing .carousel')).mount();
}

function populateClients(clients) {
  const track = $('#clients .carousel-track');
  track.innerHTML = '';
  clients.items.forEach(c => track.insertAdjacentHTML('beforeend', clientItemTpl(c)));
  new OneByOneCarousel($('#clients .carousel')).mount();
}

function populateTestimonials(tests) {
  const track = $('#testimonials .carousel-track');
  track.innerHTML = '';
  tests.items.forEach(t => track.insertAdjacentHTML('beforeend', testimonialItemTpl(t)));
  new OneByOneCarousel($('#testimonials .carousel')).mount();
}

/* ---------- Form Validation (more spacing already in CSS) ---------- */
function initForm() {
  const form = $('#contact-form');
  if (!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = $('#name'), email = $('#email'), message = $('#message');
    let ok = true;
    const setErr = (input, msg) => { ok = false; $(`.error[data-for="${input.id}"]`).textContent = msg; input.setAttribute('aria-invalid','true'); };
    const clearErr = (input) => { $(`.error[data-for="${input.id}"]`).textContent = ''; input.removeAttribute('aria-invalid'); };

    // Name
    if (!name.value.trim()) setErr(name, 'Name is required'); else clearErr(name);
    // Email
    const emailVal = email.value.trim();
    if (!emailVal) setErr(email, 'Email is required');
    else if (!/^\S+@\S+\.\S+$/.test(emailVal)) setErr(email, 'Enter a valid email');
    else clearErr(email);
    // Message
    if (!message.value.trim()) setErr(message, 'Message is required'); else clearErr(message);

    if (ok) {
      alert('Thanks! Your message has been sent (demo).');
      form.reset();
    }
  });
}

/* ---------- Nav Toggle ---------- */
function initNav() {
  const btn = $('#nav-toggle');
  const menu = $('#nav-menu');
  btn.addEventListener('click', ()=>{
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('#nav-menu a').forEach(a => a.addEventListener('click', ()=> menu.classList.remove('open')));
}

/* ---------- Init ---------- */
(async function init() {
  AOS.init({ once:true, duration:700 });

  // Load all content (prefer remote JSON, fallback to seed)
  const seed = getSeed();
  const [theme, hero, about, services, pricing, clients, testimonials, footer] = await Promise.all([
    loadJSON('data/theme.json').then(j=> j || seed.theme),
    loadJSON('data/hero.json').then(j=> j || seed.hero),
    loadJSON('data/about.json').then(j=> j || seed.about),
    loadJSON('data/services.json').then(j=> j || seed.services),
    loadJSON('data/pricing.json').then(j=> j || seed.pricing),
    loadJSON('data/clients.json').then(j=> j || seed.clients),
    loadJSON('data/testimonials.json').then(j=> j || seed.testimonials),
    loadJSON('data/footer.json').then(j=> j || seed.footer),
  ]);

  applyTheme(theme);
  renderHero(hero);
  renderAbout(about);
  $('#services-title').textContent = services?.title || 'Our Services';
  $('#pricing-title').textContent = pricing?.title || 'Pricing Plans';
  $('#clients-title').textContent = clients?.title || 'Our Clients';
  $('#testimonials-title').textContent = testimonials?.title || 'What Our Clients Say';

  populateServices(services);
  populatePricing(pricing);
  populateClients(clients);
  populateTestimonials(testimonials);

  if (footer?.contact) {
    const fc = $('#footer-contact');
    fc.innerHTML =
      `<div class="row"><i class="fas fa-envelope"></i><span>${footer.contact.email}</span></div>
       <div class="row"><i class="fas fa-phone"></i><span>${footer.contact.phone}</span></div>
       <div class="row"><i class="fas fa-map-marker-alt"></i><span>${footer.contact.address}</span></div>`;
  }
  if (footer?.social) {
    const fs = $('#footer-social');
    fs.innerHTML = footer.social.map(s => {
      const iconMap = {
        'facebook':'fab fa-facebook-f','x-twitter':'fab fa-x-twitter','linkedin':'fab fa-linkedin-in',
        'instagram':'fab fa-instagram','whatsapp':'fab fa-whatsapp'
      };
      return `<a href="${s.url || '#'}" target="_blank" rel="noopener"><i class="${iconMap[s.platform]||'fas fa-link'}"></i></a>`
    }).join('');
  }
  if (footer?.copyright) $('#footer-copy').textContent = footer.copyright;

  initForm();
  initNav();
})();
