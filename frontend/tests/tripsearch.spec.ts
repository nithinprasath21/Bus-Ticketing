import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email *' }).fill('passenger@example.com');
  await page.getByRole('textbox', { name: 'Password *' }).fill('pass123');
  await page.getByRole('button', { name: 'Login' }).click();
}

test('Landing page displays heading Bus Ticketing', async ({ page }) => {
  await login(page);
  await expect(page.getByRole('heading', { name: 'Bus Ticketing' })).toBeVisible();
});

test('Form validation: Show error on empty search', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Search Buses' }).click();
  await expect(page.getByText('Pick-up and Destination are')).toBeVisible();
  await page.screenshot({ path: 'screenshots/search/empty-search-error.png', fullPage: true });
});

test('Successful trip search shows available seats', async ({ page }) => {
  await login(page);
  await page.locator('div').filter({ hasText: /^Pick-up \*$/ }).getByRole('textbox').fill('Coimbatore');
  await page.locator('div').filter({ hasText: /^Destination \*$/ }).getByRole('textbox').fill('Banglore');
  await page.getByRole('button', { name: 'AC', exact: true }).click();
  await page.getByRole('button', { name: 'Sleeper' }).click();
  await page.getByRole('button', { name: 'Search Buses' }).click();
  await page.getByText('VolvoTN73CH9635Coimbatore → BangloreType: AC | SleeperFeatures: Blankets, Wifi₹').nth(3).click();
  await expect(page.getByText('Select your seatsA1A2A3A4A5SelectedAvailableBookedBook Seat')).toBeVisible();
  await page.screenshot({ path: 'screenshots/search/trip-search-success.png', fullPage: true });
});