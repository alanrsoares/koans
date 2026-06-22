import { defineConfig, devices } from "@playwright/test";

// Koan compilers only run in a browser (CDN-loaded transpilers, Gleam WASM, Web
// Workers), so koan-correctness is verified here rather than in `bun test`.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000/koan-test.html",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
