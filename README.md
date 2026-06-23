# Zen Koans ☯

An interactive, client-side web application inspired by [ClojureScript Koans](https://clojurescriptkoans.com/). Learn and practice JavaScript-transpiled languages directly in the browser.

## Supported Languages

- **JavaScript**
- **TypeScript**
- **ClojureScript**
- **CoffeeScript**
- **Gleam**
- **Civet**

## Getting Started

Ensure you have [Bun](https://bun.sh/) installed:

```bash
# Install dependencies
bun install

# Start the development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to begin.

## Development Scripts

- `bun run dev`: Start Vite development server
- `bun run build`: Build the production application
- `bun run check`: Run formatting, linting, and tests
- `bun run test`: Run unit tests via `bun test`
- `bun run test:koans`: Run E2E tests via Playwright
- `bun run format`: Format code with Biome
- `bun run lint`: Lint code with Biome
