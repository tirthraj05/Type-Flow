# Typing Practice (Frontend-only)

Minimal React (Vite) typing practice app — offline-ready, no login, no server.

Features
- React + Vite single-page app
- Pages: Home, Typing Test, Results, About
- Generates 150–300 character practice texts with `generateText()` (mock AI)
- Live WPM, accuracy, mistakes, progress
- Regenerate text and restart test
- Simple service worker for offline usage
- AdSense placeholders (header, sidebar, bottom)
- SEO meta tags and `sitemap.xml`

Quick start

1. Install dependencies

```powershell
cd d:/typing
npm install
```

Note: After pulling the `add-typing-practice` branch you should run `npm install` again because Tailwind/PostCSS dev dependencies were added.

2. Run dev server

```powershell
npm run dev
```

3. Build for production

```powershell
npm run build
npm run preview
```

Deploying

- Vercel: import the repo and set framework to "Vite" (default). Public folder is `public`.
- Netlify: drag & drop the `dist` folder after running `npm run build`, or connect repo and set build command `npm run build` and publish directory `dist`.

Notes
- Replace ad placeholders with real AdSense code where required.
- The app ships a small service worker at `/service-worker.js`. It caches core assets to enable offline viewing.

