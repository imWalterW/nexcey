# Nexcey Web Design Service

Single‑page, JSON‑driven site with Netlify CMS.

## Run locally
```bash
python -m http.server 5000
# then visit http://localhost:5000
```
> You can also double‑click `index.html` — the page will still render because it has inline JSON fallbacks.

## Deploy to Netlify
1. Push this folder to GitHub.
2. New site from Git → select repo → Deploy.
3. Enable **Identity** and **Git Gateway** in Site settings.
4. Visit `/admin/` to log in and edit content.

## Editing content
All copy, lists, and images live in `/data/*.json` (also editable via CMS).