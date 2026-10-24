# OneTick website

The marketing site for the OneTick iPhone app. Plain HTML, CSS and JavaScript: no build step and no dependencies.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: hero, smart categories, live to-do demo, features, screenshots, testimonials, FAQ |
| `features.html` | Every feature in detail |
| `about.html` | Story, principles, how it works |
| `support.html` | FAQ and contact form (App Store "Support URL") |
| `privacy.html` | Privacy Policy (App Store "Privacy Policy URL") |
| `terms.html` | Terms of Use |
| `404.html` | Not-found page (used automatically by Netlify, GitHub Pages, Cloudflare Pages, Vercel) |

Shared files live in `assets/`: `css/style.css`, `js/main.js` and `img/`.

## Before going live

1. **App Store link.** Set `appStoreUrl` at the top of `assets/js/main.js`. Until then, every Download button opens a "Coming to the App Store" dialog.
2. **Domain.** Links for search engines and social sharing use `https://onetick.tk`. If the site will live elsewhere, find and replace that URL in all `.html` files, `robots.txt` and `sitemap.xml`.
3. **Support email.** `support@onetick.com` is used throughout. Make sure that inbox exists and is yours (also set in `assets/js/main.js`).
4. **Legal pages.** `privacy.html` and `terms.html` are drafts based on the app's features. Check them against what the app really collects and stores before publishing.
5. **Social proof.** The "3K+ satisfied customers" figure and the three testimonials come from the Figma design; make sure they're accurate.

## Preview locally

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765. Opening `index.html` directly also works.

## Deploy

Any static host works. The quickest options: drag this folder onto [Netlify Drop](https://app.netlify.com/drop), or push it to a GitHub repo and turn on GitHub Pages or Cloudflare Pages.
