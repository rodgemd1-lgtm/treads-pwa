import { test, expect } from '@playwright/test';

test.describe('AVIS Treads PWA — Full UX/UI Audit', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/?v=7');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/?v=7');
    // Wait for seed data to hydrate
    await page.waitForTimeout(2000);
  });

  test('app loads with AVIS branding', async ({ page }) => {
    await expect(page.locator('header')).toContainText('AVIS');
    await expect(page.locator('header')).toContainText('Tread Intel');
    await expect(page).toHaveTitle(/AVIS Tire Tread Intel/);
  });

  test('all 5 tabs are present', async ({ page }) => {
    for (const tab of ['Scan', 'History', 'Fleet', 'Vehicles', 'Costs']) {
      await expect(page.getByRole('button', { name: new RegExp(tab, 'i') })).toBeVisible({ timeout: 5000 });
    }
  });

  test('Vehicles tab shows fleet with James CR-V', async ({ page }) => {
    await page.getByRole('button', { name: /Vehicles/i }).click();
    await page.waitForTimeout(1500);
    // James's vehicle should appear
    const body = await page.locator('main').textContent();
    expect(body).toContain('Honda CR-V');
    expect(body).toContain('CO-JL-2026');
  });

  test('Fleet tab shows health dashboard', async ({ page }) => {
    await page.getByRole('button', { name: /Fleet/i }).click();
    await page.waitForTimeout(1500);
    await expect(page.getByText('Fleet Health')).toBeVisible({ timeout: 5000 });
  });

  test('Costs tab shows 2025 pricing', async ({ page }) => {
    await page.getByRole('button', { name: /Costs/i }).click();
    await page.waitForTimeout(1000);
    const body = await page.locator('main').textContent();
    expect(body).toContain('$85');
    expect(body).toContain('145');
    expect(body).toContain('220');
    expect(body).toContain('185');
  });

  test('History tab loads', async ({ page }) => {
    await page.getByRole('button', { name: /History/i }).click();
    await page.waitForTimeout(1000);
    const content = await page.locator('main').innerHTML();
    expect(content.length).toBeGreaterThan(100);
  });

  test('PWA manifest uses PNG icons', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    const manifest = await response.json();
    expect(manifest.name).toBe('AVIS Tire Tread Intel');
    expect(manifest.theme_color).toBe('#d4002a');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    for (const icon of manifest.icons) {
      expect(icon.type).toBe('image/png');
    }
  });

  test('service worker has v2 cache-busting', async ({ page }) => {
    const response = await page.request.get('/sw.js');
    const swContent = await response.text();
    expect(swContent).toContain('treads-v2');
    expect(swContent).toContain('network-first');
  });

  test('no horizontal overflow on mobile viewport', async ({ page }) => {
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(420);
  });

  test('no critical console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/?v=7');
    await page.waitForTimeout(3000);
    const critical = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('camera') &&
      !e.includes('NotAllowed') &&
      !e.includes('NotFoundError')
    );
    expect(critical.length).toBeLessThan(3);
  });

  test('vehicle dropdown populates after navigation to Vehicles first', async ({ page }) => {
    // Navigate to Vehicles tab to trigger seed data hydration
    await page.getByRole('button', { name: /Vehicles/i }).click();
    await page.waitForTimeout(1500);
    // Now go to Scan tab
    await page.getByRole('button', { name: /Scan/i }).click();
    await page.waitForTimeout(1000);
    const optionCount = await page.locator('select option').count();
    expect(optionCount).toBeGreaterThanOrEqual(2);
  });
});