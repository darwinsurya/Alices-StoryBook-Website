# White Rabbit Press — Alice's Adventures in Wonderland

A Victorian storybook archive of Lewis Carroll's 1865 classic, built entirely from public domain materials. Every chapter, every engraving, every word — free for everyone forever.

## Live Demo
https://darwinsurya.github.io/Alices-StoryBook-Website/

## Features

### 📖 Reading Room
- **Chapter I & II** in full, unabridged text from the 1865 Macmillan edition
- **Jabberwocky** — with mirror-writing you can tap to unmirror
- **Through the Looking-Glass** chapter list and chess problem guide
- Adjustable text size (A+/A−) with localStorage persistence
- Reading position bookmark (resume where you left off)
- Marginalia sidenotes with literary commentary

### 🎭 Character Cards
Nine playable character cards (Alice, White Rabbit, Queen, Hatter, Caterpillar, Duchess, Mock Turtle, Dormouse, Knave) styled as Victorian playing cards with:
- Authentic Tenniel engravings
- Genuine 1865 quotes
- Role descriptions and personality traits

### 🍵 Tea Party Interactions
- **Riddles** — tap to reveal answers the Hatter never gives
- **Quiz** — "Which Wonder Are You?" (Alice, Hatter, or Cheshire Cat)
- **Ask the Cat** — rotating Cheshire wisdom
- **Pour the Tea** — animated teacup with steam

### ⚖️ Queen's Court
- Croquet ground with live flamingo mallets & hedgehog balls
- Trial of the Knave with the original verse
- **Fading Cheshire grin** — scroll and the grin disappears
- Card-suit particle rain (hearts, spades, diamonds, clubs)

### 🖼️ Gallery
11 curated Tenniel plates from the 1865 first edition, all public domain

### 👨‍💼 Author Page
Timeline of Charles Dodgson's life (1832–1898) with the boat trip that started it all

## Technical Stack

| Technology | Purpose |
|------------|---------|
| **Vanilla HTML/CSS/JS** | Zero dependencies, fast, permanent |
| **Lenis** | Smooth scroll (opt-in, respects `prefers-reduced-motion`) |
| **GSAP + ScrollTrigger** | Split-text reveals, counter animations, parallax |
| **Canvas API** | Dust motes / card-suit particles |
| **CSS Custom Properties** | Victorian color system (oxblood, cream paper, gold) |
| **IM Fell English + EB Garamond** | Period-accurate typography via Google Fonts |
| **Schema.org JSON-LD** | Structured data for SEO |

## Design System

### Colors
```css
--paper: #f6f0dd;      /* cream page */
--paper2: #efe4c8;     /* slightly darker */
--ink: #2a2118;        /* primary text */
--ink2: #5a4c3a;       /* secondary text */
--oxblood: #7b1e1e;    /* accent red */
--cardred: #b02a2a;    /* hearts/diamonds */
--gold: #a67c2e;       /* ornamental gold */
```

### Typography
- **Display**: IM Fell English (chapter titles, hero text)
- **Small Caps**: IM Fell English SC (navigation, labels)
- **Body**: EB Garamond (reading text, long-form)
- **Typewriter**: Special Elite (UI labels, metadata)

### Motion
- All animations respect `prefers-reduced-motion: reduce`
- Lenis smooth scroll optional (disabled on mobile/reduced motion)
- GSAP ScrollTrigger for choreographed reveals
- Canvas particle system (60fps, pauses when tab hidden)

## Project Structure

```
alices-book/
├── index.html           # Home — Down the Rabbit-Hole
├── characters.html      # The Who's Who — 9 character cards
├── teaparty.html        # Chapter VII — riddles, quiz, tea
├── queen.html           # Chapters VIII–XII — croquet, trial
├── carroll.html         # Author biography & timeline
├── gallery.html         # 11 Tenniel engravings
├── read.html            # Reading Room — Chapters I–II, poems
├── css/
│   └── wonder.css       # Complete design system (243 lines)
├── js/
│   └── wonder.js        # All interactions (302 lines)
├── assets/
│   └── wonder/          # 11 Tenniel engravings (JPG/PNG)
├── favicon.svg          # White Rabbit mark
└── README.md
```

## Quick Start

```bash
# Clone
git clone https://github.com/yourusername/alices-book.git
cd alices-book

# Serve locally (any static server)
npx serve .
# or
python3 -m http.server 8000
# or
php -S localhost:8000
```

Open `http://localhost:8000` — no build step required.

## Deploy to GitHub Pages

1. Push to a GitHub repository
2. Settings → Pages → Source: "Deploy from a branch"
3. Branch: `main` / `(root)` → Save
4. Your site publishes at `https://yourusername.github.io/alices-book`

## Sources & Attribution

All content is **public domain worldwide**:

- **Text**: Project Gutenberg [Ebook #11](https://www.gutenberg.org/ebooks/11) (Alice's Adventures in Wonderland) and [Ebook #12](https://www.gutenberg.org/ebooks/12) (Through the Looking-Glass)
- **Engravings**: John Tenniel's original 1865 plates via [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:John_Tenniel%27s_illustrations_of_Alice%27s_Adventures_in_Wonderland)
- **Fonts**: IM Fell English, EB Garamond, Special Elite via Google Fonts (OFL)

## License

This project is a **fan-made reading companion**. All source materials are public domain. The code (HTML, CSS, JS) is released under the [MIT License](LICENSE) — do whatever you like with it.

## Browser Support

Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+). Graceful degradation:
- No Lenis/GSAP → standard scroll, CSS reveals still work
- No Canvas → no motes, everything else intact
- Reduced motion → all animations disabled, content fully accessible

## Accessibility

- Semantic HTML5 structure
- Skip-to-content link
- Focus-visible outlines
- ARIA labels on interactive elements (riddles, quiz, mirror text)
- `prefers-reduced-motion` honored globally
- High contrast ratios (cream/ink, oxblood/cream)
- Keyboard navigable (Tab, Enter, Space, Escape)

---

<p align="center"><i>“What is the use of a book,” thought Alice, “without pictures or conversations?”</i></p>
<p align="center">This one has both.</p>
