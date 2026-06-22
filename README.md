# Zen Koans - The Path to Browser-compiled Enlightenment ☯

An interactive, client-side Code Koans web application inspired by the classic [ClojureScript Koans](https://clojurescriptkoans.com/). This application allows developers to learn and practice four different languages that compile to/run as JavaScript directly in the browser.

## Supported Languages
1. **JavaScript**: Evaluated directly via in-browser JS runtime engines.
2. **TypeScript**: Transpiled on-the-fly inside the browser using the official TypeScript Compiler API.
3. **ClojureScript**: Compiled directly in the browser to JavaScript arrays and objects using [Squint](https://github.com/squint-cljs/squint).
4. **CoffeeScript**: Transpiled on-the-fly in the browser using the CoffeeScript compiler.

---

## Key Features & UX Highlights

- **Zen Path Navigation**: Switch between languages and categories inside the sleek sidebar.
- **Sleek Dark Design**: Modern glassmorphic theme with color palettes tailored to each language (Yellow for JS, Blue for TS, Green for ClojureScript, Amber for CoffeeScript).
- **Inline Code Editing**: Interactive input fields replace `__` blanks directly within the code lines. As you type, the fields auto-expand to fit your code.
- **Real-time Compilation & Evaluation**: Verification happens instantly as you type. If your answer compiles and satisfies the assertions, it locks, glows green, and reveals a checkmark.
- **Progressive Disclosure**: Only the current active (failing) koan is editable and highlighted. Future exercises in the category are locked and blurred to keep your focus sharp.
- **Enlightenment Chimes**: Custom-synthesized audio feedback (using the Web Audio API) plays sound notes upon passing a koan and a sweet chord progression upon category completion.
- **Confetti Celebration**: Canvas-based particle explosion celebrates category completion.
- **Local Persistence**: All typed answers and completed progress are automatically saved to `localStorage` so you never lose your progress.

---

## Project Structure
- `index.html` — Base layout structure, loading fonts and initializing files.
- `index.css` — Global styling sheets including CSS variables, layout, animations, syntax highlighting, and theme colors.
- `app.js` — The main orchestrator managing states, event listeners, focus changes, particle canvas animations, and Web Audio synthesizers.
- `koans.js` — Detailed data structure defining all categories, description logs, quotes, and exercise assertion code.
- `compiler.js` — Runtime compiler managers that dynamically load transpilers from CDNs on-demand.
- `tokenizer.js` — Custom lexical parser splitting code blocks into colorized HTML tags and injecting input fields.
- `server.js` — Lightweight static file web server using Bun.

---

## How to Run

Ensure you have [Bun](https://bun.sh/) installed, then run:

```bash
# 1. Install local dependencies for dev checking
bun install

# 2. Start the local server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

*Note: Since the app loads compilers (like TypeScript, CoffeeScript, and Squint) on-demand from public CDNs, you should have an active internet connection when running these compilers for the first time. The `@onrails/result` dependency is served locally from the `~/dev/onrails` workspace via routing interceptions in `server.js`.*
