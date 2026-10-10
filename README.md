# 🛡️ Spot the Scam!

An interactive, single-page cybersecurity awareness course that teaches people how to tell **real from fake** and **legit from scam**. Learners follow a winding road of 10 lessons, inspect realistic emails, texts, login pages and social posts by hovering over them, pass a quiz at every stop, and finish with a final exam. A mascot celebrates every pass.

**Live demo:** https://kapilbam.github.io/spot-the-scam/

<!-- Add screenshots here, for example:
![Roadmap dashboard](screenshots/roadmap.png)
![Hover-to-inspect example](screenshots/inspect.png)
-->

## What's inside

- **10 lessons:** phishing, fake emails, passwords, 2FA, social engineering, social media habits, public Wi-Fi, scam recognition, personal information, malware and ransomware.
- **Learn → inspect → quiz** in every lesson: a spot-check, a real-vs-fake comparison, key facts, 5–7 hover-to-inspect examples (🚩 warning signs, ✅ good signs), then a 10-question quiz (multiple choice, real-or-fake mockups, and match-the-following). Pass mark: 6/10.
- **Gated progress:** each lesson unlocks only after the previous quiz is passed. The car on the road drives to the next stop and unlocks it with an animation.
- **Final exam:** 20 fresh questions, unlocked after all 10 lessons.
- **Extras:** account sign-in, dark/light theme, user menu, badges, confetti mascot, sound effects, keyboard and reduced-motion support.

## Run it

There is no build step and no dependencies.

1. Download or clone the repo.
2. Run `npm start` (or any static server) and visit http://localhost:8000.

Sign-in uses the Web Crypto API, which needs `https://` or `localhost`. On GitHub Pages this works automatically. If you open the file directly from disk and sign-in fails, serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy on GitHub Pages

1. Push `index.html`, `package.json`, the `src/` folder and this README to the repo's `main` branch.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

## Project structure

```
spot-the-scam/
├── index.html
├── package.json
└── src/
    ├── style.css
    ├── auth.js
    ├── audio.js
    ├── inspection.js
    └── app.js
```

| File | What it does |
|------|--------------|
| `index.html` | Page shell: header, app container, confetti canvas, script tags |
| `package.json` | Project metadata and helper scripts (no dependencies) |
| `src/style.css` | Light/dark themes, layout, mock-interface styles, roadmap and mascot |
| `src/audio.js` | Synthesized sound effects (Web Audio API) |
| `src/auth.js` | Sign-up / sign-in: PBKDF2 hashing, password rules, lockout, idle sessions |
| `src/inspection.js` | Mock emails, texts, web pages, profiles; real-vs-fake comparisons; hover-to-inspect examples; real-or-fake quiz mockups |
| `src/app.js` | Lessons, roadmap dashboard, quiz engine, final exam, mascot, confetti, start-up |

The scripts are classic (non-module) scripts that share one global scope, so `index.html` loads them in this order: `audio.js`, `auth.js`, `app.js`, `inspection.js`.

Handy commands (optional): `npm start` serves the site at http://localhost:8000 (uses Python), `npm run serve` uses `npx serve`, and `npm run check` syntax-checks every script.

## Tech

HTML5, CSS custom properties (light/dark theming), vanilla JavaScript (ES6+), Web Crypto API (PBKDF2), Web Audio API, canvas confetti, inline SVG. No frameworks, no external scripts. Font: Nunito via Google Fonts.

## Security note

The sign-in is a **client-side demo**. Passwords are never stored; only a salted PBKDF2-SHA-256 hash (600,000 rounds) is kept in the browser's `localStorage`, with lockouts after repeated failures and a 20-minute idle session timeout. Because there is no server, it cannot offer server-side rate limiting, email verification, password reset or 2FA, and anyone with access to the device could attack the stored data. A production version would need a backend (Argon2id hashing, server-side rate limiting, secure session cookies).

Accounts and progress live only in each visitor's own browser.

## Skills demonstrated

Security awareness training design, phishing and social-engineering analysis, secure client-side authentication practices, accessible UI, and interactive front-end development.

## License

Add a license of your choice (for example MIT) as `LICENSE`.
