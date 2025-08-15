
// Global config (can be overridden via /data/theme.json)
const THEME = {
  primary: "#522cb5",
  primaryLight: "#7c52d6",
  primaryDark: "#3d2088",
  secondary: "#f8f9fa",
  textDark: "#2c3e50",
  textLight: "#6c757d",
  white: "#ffffff",
  fontFamily: "Arial, sans-serif",
  bodyFontSize: "15px",
  autoplayEnabled: true,
  autoplayInterval: 4000,
  pauseOnHover: true,
  loop: true
};

// Utility
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));
const safe = (v, d="") => (v===undefined || v===null) ? d : v;

// Sticky header
const header = document.getElementById("site-header");
window.addEventListener("scroll", () => {
  if(window.scrollY > 10) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
});

// Mobile menu
$("#hamburger").addEventListener("click", ()=> {
  $("#menu").classList.toggle("open");
});

// Smooth anchor close on click (mobile)
$("#menu").addEventListener("click", (e)=>{
  if(e.target.tagName === "A") $("#menu").classList.remove("open");
});

// Carousel engine
class Carousel {
  constructor({rootId, trackId, prevId, nextId, itemsPerSlideDesktop=4, itemsPerSlideTablet=2, itemsPerSlideMobile=1, interval=4000, pauseOnHover=true, loop=true}){
    this.root = document.getElementById(rootId);
    this.track = document.getElementById(trackId);
    this.prevBtn = document.getElementById(prevId);
    this.nextBtn = document.getElementById(nextId);
    this.interval = interval;
    this.pauseOnHover = pauseOnHover;
    this.loop = loop;
    this.index = 0;
    this.itemsPerSlideDesktop = itemsPerSlideDesktop;
    this.itemsPerSlideTablet = itemsPerSlideTablet;
    this.itemsPerSlideMobile = itemsPerSlideMobile;
    this.timer = null;
    this.itemWidth = 0;
    this.items = [];
    this.userInteracted = false;
    this.bind();
  }
  bind(){
    if(this.prevBtn) this.prevBtn.addEventListener("click", ()=> this.prev());
    if(this.nextBtn) this.nextBtn.addEventListener("click", ()=> this.next());
    if(this.pauseOnHover && this.root){
      this.root.addEventListener("mouseenter", ()=> this.stop());
      this.root.addEventListener("mouseleave", ()=> { if(!this.userInteracted) this.start(); });
    }
    // touch support
    let startX = 0;
    this.root.addEventListener("touchstart", (e)=> { startX = e.touches[0].clientX; }, {passive:true});
    this.root.addEventListener("touchend", (e)=> {
      const dx = e.changedTouches[0].clientX - startX;
      if(Math.abs(dx) > 40){ dx < 0 ? this.next() : this.prev(); }
    });
    window.addEventListener("resize", ()=> this.layout());
  }
  setItems(items){
    this.items = items;
    this.layout();
  }
  itemsPerView(){
    const w = window.innerWidth;
    if(w < 768) return this.itemsPerSlideMobile;
    if(w < 1200) return this.itemsPerSlideTablet;
    return this.itemsPerSlideDesktop;
  }
  layout(){
    const n = this.itemsPerView();
    this.itemWidth = this.root.clientWidth / n - 18; // minus gap
    this.items.forEach(el => el.style.minWidth = `${this.itemWidth}px`);
    this.goto(this.index);
  }
  goto(i){
    const maxIndex = Math.max(0, this.items.length - this.itemsPerView());
    this.index = Math.max(0, Math.min(i, maxIndex));
    const x = - (this.itemWidth + 18) * this.index; // include gap
    this.track.style.transform = `translateX(${x}px)`;
  }
  next(){
    this.userInteracted = true;
    if(this.index + this.itemsPerView() < this.items.length) this.goto(this.index + 1);
    else if(this.loop) this.goto(0);
    this.stop();
  }
  prev(){
    this.userInteracted = true;
    if(this.index > 0) this.goto(this.index - 1);
    else if(this.loop) this.goto(this.items.length);
    this.stop();
  }
  start(){
    if(this.timer) return;
    this.timer = setInterval(()=> this.next(), this.interval);
  }
  stop(){
    if(this.timer){ clearInterval(this.timer); this.timer = null; }
  }
}

// Render helpers
function serviceCard(svc){
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <div class="icon"><i class="${svc.icon || 'fas fa-rocket'}"></i></div>
    <h3>${svc.name || 'Service name'}</h3>
    <p>${svc.description || 'Service description'}</p>
  `;
  return div;
}
function priceCard(plan){
  const div = document.createElement("div");
  div.className = "card";
  const badge = plan.popular ? `<span class="badge">Most Popular</span>` : "";
  div.innerHTML = `
    ${badge}
    <h3>${plan.name || 'Plan'}</h3>
    <div class="price">${plan.price || '$XXX'}</div>
    <ul>${(plan.features||[]).map(f=>`<li><i class="fas fa-check"></i> ${f}</li>`).join('')}</ul>
    <button class="btn btn-white plan-cta"><i class="fas fa-check-circle"></i> <span>${(plan.ctaButton && plan.ctaButton.text) || 'Choose Plan'}</span></button>
  `;
  return div;
}
function clientCard(c){
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px">
      <img class="client-logo" src="${c.logo || '/assets/images/logo.png'}" alt="${c.name || 'Client'}"/>
      <strong>${c.name || ''}</strong>
    </div>
    ${c.websiteImage ? `<img class="client-site" src="${c.websiteImage}" alt="${c.name || 'Client site'}"/>` : ''}
    ${c.websiteUrl ? `<div style="margin-top:10px"><a href="${c.websiteUrl}" class="btn btn-white" target="_blank" rel="noopener"><i class="fas fa-up-right-from-square"></i> <span>Visit Website</span></a></div>` : ''}
  `;
  return div;
}
function testimonialCard(t){
  const div = document.createElement("div");
  div.className = "card testimonial";
  const who = t.displayFormat === "Name, Position at Company"
    ? `${t.name || ''}, ${t.position || ''}${t.company ? ' at ' + t.company : ''}`
    : `${t.name || ''} - ${t.position || ''}`;
  div.innerHTML = `
    <div class="person">
      <img src="${t.image || '/assets/images/logo.png'}" alt="${t.name || 'Client'}"/>
      <div>
        <div style="font-weight:800">${who}</div>
        ${t.company && t.displayFormat!=="Name, Position at Company" ? `<div style="color:#6c757d">${t.company}</div>`:''}
      </div>
    </div>
    <p>${t.comment || ''}</p>
  `;
  return div;
}

// Load JSON and render
async function loadJSON(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

async function boot(){
  try{
    // Theme
    const theme = await loadJSON("/data/theme.json").catch(()=> ({}));
    const t = {...THEME, ...theme};
    document.documentElement.style.setProperty("--primary", t.primary);
    document.documentElement.style.setProperty("--primaryLight", t.primaryLight);
    document.documentElement.style.setProperty("--primaryDark", t.primaryDark);
    document.body.style.fontFamily = t.fontFamily;
    document.body.style.fontSize = t.bodyFontSize;

    // Hero
    const hero = await loadJSON("/data/hero.json");
    $("#hero-title").textContent = hero.content.title || "Web Design that Drives Results";
    $("#hero-subtitle").textContent = hero.content.subtitle || "Modern, responsive websites tailored to your brand.";
    const cta = $("#hero-cta");
    cta.querySelector("span").textContent = hero.content.ctaButton?.text || "Get Started";
    cta.setAttribute("href", hero.content.ctaButton?.link || "#contact");

    // About
    const about = await loadJSON("/data/about.json");
    $("#about-title").textContent = about.content.title || "About Nexcey";
    $("#about-text").textContent = about.content.text || "Company description text";
    if(about.content.image) $("#about-image").src = about.content.image;
    else $("#about-image").src = "/assets/images/logo.png";

    // Services
    const servicesData = await loadJSON("/data/services.json");
    $("#services-title").textContent = servicesData.content.title || "Our Services";
    const services = servicesData.content.services || [];
    const gridS = $("#services-grid");
    const carS = $("#services-carousel");
    if(services.length <= 4){
      // grid
      services.forEach(s => gridS.appendChild(serviceCard(s)));
      gridS.classList.remove("hidden");
      carS.classList.add("hidden");
    }else{
      // carousel
      const track = $("#services-track");
      track.innerHTML = "";
      services.forEach(s => track.appendChild(serviceCard(s)));
      const items = Array.from(track.children);
      const car = new Carousel({
        rootId:"services-carousel",
        trackId:"services-track",
        prevId:"services-prev",
        nextId:"services-next",
        itemsPerSlideDesktop:4, itemsPerSlideTablet:2, itemsPerSlideMobile:1,
        interval: t.autoplayInterval, pauseOnHover: t.pauseOnHover, loop: t.loop
      });
      car.setItems(items);
      if(t.autoplayEnabled) car.start();
      gridS.classList.add("hidden");
      carS.classList.remove("hidden");
    }

    // Pricing
    const pricingData = await loadJSON("/data/pricing.json");
    $("#pricing-title").textContent = pricingData.content.title || "Pricing Plans";
    const plans = pricingData.content.plans || [];
    const gridP = $("#pricing-grid");
    const carP = $("#pricing-carousel");
    if(plans.length <= 3){
      plans.forEach(p => gridP.appendChild(priceCard(p)));
      gridP.classList.remove("hidden");
      carP.classList.add("hidden");
    }else{
      const track = $("#pricing-track");
      track.innerHTML = "";
      plans.forEach(p => track.appendChild(priceCard(p)));
      const items = Array.from(track.children);
      const car = new Carousel({
        rootId:"pricing-carousel",
        trackId:"pricing-track",
        prevId:"pricing-prev",
        nextId:"pricing-next",
        itemsPerSlideDesktop:3, itemsPerSlideTablet:2, itemsPerSlideMobile:1,
        interval: t.autoplayInterval, pauseOnHover: t.pauseOnHover, loop: t.loop
      });
      car.setItems(items);
      if(t.autoplayEnabled) car.start();
      gridP.classList.add("hidden");
      carP.classList.remove("hidden");
    }

    // Clients
    const clientsData = await loadJSON("/data/clients.json");
    $("#clients-title").textContent = clientsData.content.title || "Our Clients";
    const clients = clientsData.content.clients || [];
    const gridC = $("#clients-grid");
    const carC = $("#clients-carousel");
    if(clients.length <= 3){
      clients.forEach(c => gridC.appendChild(clientCard(c)));
      gridC.classList.remove("hidden");
      carC.classList.add("hidden");
    }else{
      const track = $("#clients-track");
      track.innerHTML = "";
      clients.forEach(c => track.appendChild(clientCard(c)));
      const items = Array.from(track.children);
      const car = new Carousel({
        rootId:"clients-carousel",
        trackId:"clients-track",
        prevId:"clients-prev",
        nextId:"clients-next",
        itemsPerSlideDesktop:3, itemsPerSlideTablet:2, itemsPerSlideMobile:1,
        interval: t.autoplayInterval, pauseOnHover: t.pauseOnHover, loop: t.loop
      });
      car.setItems(items);
      if(t.autoplayEnabled) car.start();
      gridC.classList.add("hidden");
      carC.classList.remove("hidden");
    }

    // Testimonials
    const testiData = await loadJSON("/data/testimonials.json");
    $("#testimonials-title").textContent = testiData.content.title || "What Our Clients Say";
    const testimonials = testiData.content.testimonials || [];
    const gridT = $("#testimonials-grid");
    const carT = $("#testimonials-carousel");
    if(testimonials.length <= 3){
      testimonials.forEach(t => gridT.appendChild(testimonialCard(t)));
      gridT.classList.remove("hidden");
      carT.classList.add("hidden");
    }else{
      const track = $("#testimonials-track");
      track.innerHTML = "";
      testimonials.forEach(t => track.appendChild(testimonialCard(t)));
      const items = Array.from(track.children);
      const car = new Carousel({
        rootId:"testimonials-carousel",
        trackId:"testimonials-track",
        prevId:"testimonials-prev",
        nextId:"testimonials-next",
        itemsPerSlideDesktop:3, itemsPerSlideTablet:2, itemsPerSlideMobile:1,
        interval: t.autoplayInterval, pauseOnHover: t.pauseOnHover, loop: t.loop
      });
      car.setItems(items);
      if(t.autoplayEnabled) car.start();
      gridT.classList.add("hidden");
      carT.classList.remove("hidden");
    }

    // Contact cards + footer from footer.json
    const footerData = await loadJSON("/data/footer.json");
    // contact left cards
    const cc = $("#contact-cards");
    (footerData.contactInfo || []).forEach(item => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `<i class="${item.icon || 'fas fa-circle-info'}"></i><span>${item.value || ''}</span>`;
      cc.appendChild(div);
    });
    // footer middle contact info
    const mid = $("#footer-middle");
    (footerData.contactInfo || []).forEach(item => {
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `<i class="${item.icon || 'fas fa-circle-info'}"></i><span>${item.value || ''}</span>`;
      mid.appendChild(row);
    });
    // footer right socials
    const right = $("#footer-right");
    (footerData.socialLinks || []).forEach(s => {
      const a = document.createElement("a");
      a.href = s.url || "#";
      a.target = "_blank"; a.rel="noopener";
      a.innerHTML = `<i class="${s.icon || 'fab fa-globe'}"></i>`;
      right.appendChild(a);
    });
    $("#copyright").textContent = footerData.copyrightText || "© Nexcey. All rights reserved.";

    // AOS
    AOS.init({ once:true, duration:600, easing:"ease" });

    // Contact validation
    const form = $("#contact-form");
    form.addEventListener("submit", (e)=>{
      let ok = true;
      const name = $("#name"), email=$("#email"), message=$("#message");
      // reset errors
      $$(".error").forEach(el=> el.classList.remove("error"));
      $$(".error-msg").forEach(el=> el.remove());
      // name
      if(!name.value.trim()){ ok=false; name.classList.add("error"); name.insertAdjacentHTML("afterend", `<div class="error-msg">Name is required.</div>`); }
      // email
      const emailVal = email.value.trim();
      if(!emailVal || !/^\S+@\S+\.\S+$/.test(emailVal)){ ok=false; email.classList.add("error"); email.insertAdjacentHTML("afterend", `<div class="error-msg">Valid email is required.</div>`); }
      // message
      if(!message.value.trim()){ ok=false; message.classList.add("error"); message.insertAdjacentHTML("afterend", `<div class="error-msg">Message is required.</div>`); }
      if(!ok){ e.preventDefault(); alert("Please correct the highlighted fields."); }
      else { alert("Thanks! Your message has been submitted."); }
    });

  }catch(err){
    console.error(err);
    alert("Error initializing site: " + err.message);
  }
}

document.addEventListener("DOMContentLoaded", boot);
