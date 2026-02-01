# leonid-zh.github.io

Minimal, static portfolio site for a Platform / DevOps Engineer. Content is stored in `data.json` and rendered into the HTML at runtime.

## Structure
- `index.html` — semantic layout with placeholders
- `styles.css` — styling only (no frameworks)
- `main.js` — loads `data.json` and renders content
- `data.json` — resume data (skills, experience, education, languages, links)
- `favicon.svg` — site icon

## Update content
Edit `data.json` only. No other files need to change unless you want layout/styling updates.

## Deploy
This repo is intended for GitHub Pages. Push to the default branch and GitHub Pages will serve `index.html`.
