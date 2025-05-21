import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill('passenger@example.com');
  await page.getByRole('textbox', { name: 'Password *' }).click();
  await page.getByRole('textbox', { name: 'Password *' }).fill('pass123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Bus Ticketing' })).toBeVisible();
  await page.getByRole('button', { name: 'P', exact: true }).click();
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page.getByText('LoginEnter your email below')).toBeVisible();
});