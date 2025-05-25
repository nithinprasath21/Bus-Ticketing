import { test, expect } from '@playwright/test';

test('Booking and Cancellation of Seats', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill('passenger4@example.com');
  await page.getByRole('textbox', { name: 'Password *' }).click();
  await page.getByRole('textbox', { name: 'Password *' }).fill('pass123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('div').filter({ hasText: /^Pick-up \*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Pick-up \*$/ }).getByRole('textbox').fill('Coimbatore');
  await page.locator('div').filter({ hasText: /^Destination \*$/ }).getByRole('textbox').click();
  await page.locator('div').filter({ hasText: /^Destination \*$/ }).getByRole('textbox').fill('Banglore');
  await page.getByRole('button', { name: 'Search Buses' }).click();
  await page.getByText('VolvoTN73CH9635Coimbatore → BangloreType: AC | SleeperFeatures: Blankets, Wifi₹').nth(3).click();
  await expect(page.getByText('Volvo₹')).toBeVisible();
  await page.getByRole('button', { name: 'A5' }).click();
  await expect(page.getByText('Seat ₹500')).toBeVisible();
  await page.screenshot({ path: 'screenshots/reservation/booking/trip-search.png', fullPage: true });
  await page.getByRole('button', { name: 'Book Seat' }).click();
  await expect(page.getByText('You are about to book 1 seat')).toBeVisible();
  await page.screenshot({ path: 'screenshots/reservation/booking/booking-confirmation.png', fullPage: true });
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.getByRole('button', { name: '← Back to Trips' }).click();
  await page.getByRole('button', { name: 'View Bookings' }).click();
  await expect(page.getByText('Coimbatore ➝ Banglore').last()).toBeVisible();
  await page.getByText('Coimbatore ➝ Banglore').last().click();
  await expect(page.getByText('Seat a5(booked)')).toBeVisible();
  await page.screenshot({ path: 'screenshots/reservation/booking/booking-success.png', fullPage: true });
  await page.getByRole('button', { name: 'Cancel Trip' }).click();
  await page.getByRole('button', { name: 'a5' }).click();
  await page.getByRole('button', { name: 'a5' }).click();
  await page.screenshot({ path: 'screenshots/reservation/cancellation/cancel-confirmation.png', fullPage: true });
  page.once('dialog', dialog => {
    expect(dialog.message()).toContain('Are you sure? Ticket cancellation is irreversible.');
    dialog.accept();
  });
  await page.getByRole('button', { name: 'Cancel Selected Seats' }).click();
  page.once('dialog', dialog => {
    expect(dialog.message()).toContain('Cancellation successful!');
    dialog.accept();
  });
  await page.waitForTimeout(1000);
  await page.goto('http://localhost:5173/bookings');
  await page.getByText('Coimbatore ➝ Banglore').last().click();
  await expect(page.getByText('Seat a5(cancelled)')).toBeVisible();
  await page.screenshot({ path: 'screenshots/reservation/cancellation/cancel-success.png', fullPage: true });
});
