import { test, expect } from '@playwright/test';

test('Login page is visible', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.getByText('LoginEnter your email below')).toBeVisible();
  await page.screenshot({ path: 'screenshots/login/login-page.png', fullPage: true });
});

test('Invalid login shows error', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email *' }).fill('passenger@example.com');
  await page.getByRole('textbox', { name: 'Password *' }).fill('pass');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Invalid email or password')).toBeVisible();
  await page.screenshot({ path: 'screenshots/login/invalid-login.png', fullPage: true });
});

test('Successful login redirects to homepage', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email *' }).fill('passenger@example.com');
  await page.getByRole('textbox', { name: 'Password *' }).fill('pass123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Bus Ticketing' })).toBeVisible();
  await page.screenshot({ path: 'screenshots/login/home-page.png', fullPage: true });
});