
# Nexcey Web Design Service — Static Site + Netlify CMS

**Stack:** HTML5, CSS3, Vanilla JS, Netlify CMS (Git Gateway + Identity).

## Quick Start (Local Preview)
```bash
python -m http.server 8080
# open http://localhost:8080
```

## Deploy to Netlify
1. Push this folder to a GitHub repo.
2. Create a new site in Netlify and connect the repo.
3. In Netlify **Site settings → Identity**: Enable Identity, set **Invite only**.
4. In Identity → **Services**: Enable **Git Gateway**.
5. Invite yourself via Identity.
6. Visit `/admin/` to log in and edit content.

## CMS Notes
- All content lives in `/data/*.json` and images in `/assets/images/uploads/`.
- Font Awesome 6.4.0 is loaded in `<head>` before any icons.
- AOS animations are enabled; disable via `/data/theme.json` (set autoplay or change font).

## Contact Form
- Uses Netlify Forms with front-end validation. Submissions appear under **Forms** in Netlify.

## Carousels
- Manual arrows and autoplay with pause-on-hover.
- Services: grid ≤4, else carousel.
- Pricing: grid ≤3, else carousel.
- Clients: grid ≤3, else carousel.
- Testimonials: grid ≤3, else carousel.

## Customize Theme
Edit `/data/theme.json` to change colors, fonts (Google-font-like names allowed), and carousel behavior.
