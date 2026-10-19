import { defineConfig, devices } from '@playwright/test';

const developmentUrl = 'http://127.0.0.1:5173';
const productionUrl = 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: './e2e',
  timeout: 15_000,
  expect: { timeout: 5_000 },
  reporter: 'list',
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev -- --host 127.0.0.1',
      url: developmentUrl,
      reuseExistingServer: true,
    },
    {
      command: 'npm run preview -- --host 127.0.0.1',
      url: productionUrl,
      reuseExistingServer: true,
    },
  ],
  projects: [
    {
      name: 'desktop',
      testIgnore: /production\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: developmentUrl },
    },
    {
      name: 'android',
      testIgnore: /production\.spec\.ts/,
      use: { ...devices['Pixel 7'], baseURL: developmentUrl },
    },
    {
      name: 'iphone',
      testIgnore: /production\.spec\.ts/,
      use: { ...devices['iPhone 13'], baseURL: developmentUrl },
    },
    {
      name: 'production',
      testMatch: /production\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: productionUrl },
    },
  ],
});

