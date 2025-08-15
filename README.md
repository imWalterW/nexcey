
# Nexcey — Web Design Agency (Static Site)

A production-ready static website built with HTML, CSS, and vanilla JavaScript. Content is fully editable via Netlify CMS.

## Features
- Single-page layout with sticky header and smooth scrolling
- Manual carousel with auto-play and pause-on-hover for Services, Pricing, Clients, and Testimonials
- AOS scroll animations + Font Awesome icons
- Netlify CMS with Git Gateway + Netlify Identity
- Contact form using Netlify Forms + basic validation
- Responsive across desktop, tablet, and mobile

## Quick Start (Local)
1. Serve the folder locally (any static server). For example:
   ```bash
   npx serve .
   ```
2. Open http://localhost:3000 (or the URL shown by the server).

> Note: The Admin (/admin) requires Netlify Identity, which works once the site is deployed on Netlify.

## Deploy to Netlify
1. Push this folder to a GitHub repo.
2. On Netlify, connect the repo and deploy.
3. Enable **Identity** and **Git Gateway**, then invite yourself as a user.
4. Visit `/admin/` to log in and edit content.

## Editing Content
All editable content lives under `/data/*.json`. Update via Netlify CMS or manually.

## File Structure
- `index.html`
- `assets/css/style.css`
- `assets/js/script.js`
- `assets/images/` (includes placeholder logo and favicon)
- `data/*.json` (site content)
- `admin/index.html`, `admin/config.yml` (Netlify CMS)
- `netlify.toml` (headers + redirect)
- `package.json`, `.gitignore`, `README.md`

## License
MIT — use and adapt freely.
