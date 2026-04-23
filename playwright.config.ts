import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'https://treads-pwa.vercel.app',
    browserName: 'chromium',
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro
    locale: 'en-US',
  },
  projects: [
    { name: 'mobile', use: { viewport: { width: 390, height: 844 } } },
  ],
});