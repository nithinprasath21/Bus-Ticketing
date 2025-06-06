import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173',
    browserName: 'chromium',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
