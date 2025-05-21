import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill('passenger@example.com');
  await page.getByRole('textbox', { name: 'Password *' }).click();
  await page.getByRole('textbox', { name: 'Password *' }).fill('pass123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('div').filter({ hasText: /^Pick-up \*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Pick-up \*$/ }).getByRole('textbox').fill('Coimbatore');
  await page.locator('div').filter({ hasText: /^Destination \*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Destination \*$/ }).getByRole('textbox').fill('Banglore');
  await page.getByRole('button', { name: 'AC', exact: true }).click();
  await page.getByRole('button', { name: 'Sleeper' }).click();
  await page.getByRole('button', { name: 'Search Buses' }).click();
  await page.getByText('VolvoTN73CH9635Coimbatore → BangloreType: AC | SleeperFeatures: Blankets, Wifi₹').nth(3).click();
  await expect(page.getByText('← Back to TripsVolvo₹')).toBeVisible();
  await expect(page.getByText('Select your seatsA1A2A3A4A5SelectedAvailableBookedBook Seat')).toBeVisible();
  await page.getByRole('button', { name: '← Back to Trips' }).click();
  await page.getByRole('button', { name: 'P', exact: true }).click();
  await page.getByRole('button', { name: 'Logout' }).click();
});