import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results/production',
  use: { baseURL: 'http://127.0.0.1:4174/QuizGame/', channel: 'msedge' },
  webServer: {
    command: 'node scripts/serve-built-site.mjs',
    url: 'http://127.0.0.1:4174/QuizGame/',
    reuseExistingServer: false,
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
});
