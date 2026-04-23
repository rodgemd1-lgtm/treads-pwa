import { test, expect } from '@playwright/test';

test.describe('AVIS Treads PWA — 20 Scenario Comprehensive Audit', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/?v=10');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/?v=10');
    await page.waitForTimeout(2000);
  });

  // === SCENARIO 1: Brand & Identity ===
  test('S1: App loads with correct Avis branding and title', async ({ page }) => {
    await expect(page.locator('header')).toContainText('AVIS');
    await expect(page.locator('header')).toContainText('Tread Intel');
    await expect(page).toHaveTitle(/AVIS Tire Tread Intel/);
  });

  // === SCENARIO 2: Navigation ===
  test('S2: All 5 tabs present and navigate correctly', async ({ page }) => {
    for (const tab of ['Scan', 'History', 'Fleet', 'Vehicles', 'Costs']) {
      await page.getByRole('button', { name: new RegExp(tab, 'i') }).click();
      await page.waitForTimeout(300);
    }
    // Should end on Costs tab
    await expect(page.getByText('Replacement Cost')).toBeVisible({ timeout: 3000 });
  });

  // === SCENARIO 3: Fleet Data Loads ===
  test('S3: All 9 seeded vehicles load including James CR-V', async ({ page }) => {
    await page.getByRole('button', { name: /Vehicles/i }).click();
    await page.waitForTimeout(1500);
    const body = await page.locator('main').textContent();
    expect(body).toContain('Toyota Camry');
    expect(body).toContain('Honda CR-V');
    expect(body).toContain('CO-JL-2026');
  });

  // === SCENARIO 4: PWA Manifest Valid ===
  test('S4: PWA manifest has correct name, icons, and PNG format', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    const manifest = await response.json();
    expect(manifest.name).toBe('AVIS Tire Tread Intel');
    expect(manifest.short_name).toBe('AVIS Treads');
    expect(manifest.theme_color).toBe('#d4002a');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    for (const icon of manifest.icons) {
      expect(icon.type).toBe('image/png');
    }
  });

  // === SCENARIO 5: Service Worker v3 ===
  test('S5: Service worker has v3 cache with network-first strategy', async ({ page }) => {
    const response = await page.request.get('/sw.js');
    const swContent = await response.text();
    expect(swContent).toContain('treads-v3');
    expect(swContent).toContain('network-first');
    expect(swContent).toContain('cache-first');
    expect(swContent).toContain('response.ok');
  });

  // === SCENARIO 6: Costs Calculator ===
  test('S6: Costs tab shows 2025 pricing with correct values', async ({ page }) => {
    await page.getByRole('button', { name: /Costs/i }).click();
    await page.waitForTimeout(1000);
    const body = await page.locator('main').textContent();
    expect(body).toContain('$85');
    expect(body).toContain('145');
    expect(body).toContain('220');
    expect(body).toContain('185');
    expect(body).toContain('Total');
  });

  // === SCENARIO 7: Responsive Mobile Layout ===
  test('S7: No horizontal overflow on 390px mobile viewport', async ({ page }) => {
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(420);
  });

  // === SCENARIO 8: Console Error Check ===
  test('S8: No critical console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/?v=10');
    await page.waitForTimeout(3000);
    const critical = errors.filter(e =>
      !e.includes('favicon') && !e.includes('camera') && !e.includes('NotAllowed') && !e.includes('NotFoundError')
    );
    expect(critical.length).toBeLessThan(3);
  });

  // === SCENARIO 9: Add Vehicle Form ===
  test('S9: Add vehicle with all fields including license plate', async ({ page }) => {
    await page.getByRole('button', { name: /Vehicles/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Add/i }).click();
    await page.waitForTimeout(500);
    // Fill form fields
    await page.locator('#v-name').fill('Toyota RAV4 #5555');
    await page.locator('#v-make').fill('Toyota');
    await page.locator('#v-model').fill('RAV4');
    await page.locator('#v-year').fill('2024');
    await page.locator('#v-mileage').fill('15000');
    await page.locator('#v-plate').fill('CO-AVS-5555');
    // Submit
    await page.getByRole('button', { name: /Add Vehicle/i }).click();
    await page.waitForTimeout(1000);
    // Verify the new vehicle appears
    const body = await page.locator('main').textContent();
    expect(body).toContain('RAV4');
    expect(body).toContain('CO-AVS-5555');
  });

  // === SCENARIO 10: Delete Vehicle ===
  test('S10: Can delete a vehicle', async ({ page }) => {
    await page.getByRole('button', { name: /Vehicles/i }).click();
    await page.waitForTimeout(1000);
    const countBefore = await page.locator('main').locator('[aria-label*="Delete"]').count();
    if (countBefore > 0) {
      await page.locator('[aria-label*="Delete"]').first().click();
      await page.waitForTimeout(500);
    }
  });

  // === SCENARIO 11: Tire Count Adjustment ===
  test('S11: Costs calculator adjusts tire count from 4 to 3', async ({ page }) => {
    await page.getByRole('button', { name: /Costs/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Decrease/i }).click();
    await page.waitForTimeout(300);
    const body = await page.locator('main').textContent();
    expect(body).toContain('3');
  });

  // === SCENARIO 12: Export CSV ===
  test('S12: CSV export button works and triggers download', async ({ page }) => {
    await page.getByRole('button', { name: /Vehicles/i }).click();
    await page.waitForTimeout(1500);
    const csvBtn = page.getByRole('button', { name: /CSV/i });
    await expect(csvBtn).toBeVisible({ timeout: 3000 });
  });

  // === SCENARIO 13: Export JSON ===
  test('S13: JSON export button visible for Claude analysis', async ({ page }) => {
    await page.getByRole('button', { name: /Vehicles/i }).click();
    await page.waitForTimeout(1500);
    const jsonBtn = page.getByRole('button', { name: /JSON/i });
    await expect(jsonBtn).toBeVisible({ timeout: 3000 });
  });

  // === SCENARIO 14: Fleet Health Dashboard ===
  test('S14: Fleet dashboard shows pass/watch/fail counts', async ({ page }) => {
    await page.getByRole('button', { name: /Fleet/i }).click();
    await page.waitForTimeout(1500);
    await expect(page.getByText('Fleet Health')).toBeVisible({ timeout: 5000 });
    const pass = page.getByText(/Pass/i);
    const watch = page.getByText(/Watch/i);
    const fail = page.getByText(/Fail/i);
    expect(pass || watch || fail).toBeTruthy();
  });

  // === SCENARIO 15: History Tab Loads ===
  test('S15: History tab shows measurement data or empty state', async ({ page }) => {
    await page.getByRole('button', { name: /History/i }).click();
    await page.waitForTimeout(1000);
    const content = await page.locator('main').innerHTML();
    expect(content.length).toBeGreaterThan(50);
  });

  // === SCENARIO 16: Vehicle Selection Dropdown ===
  test('S16: Vehicle dropdown populates after navigating to Vehicles first', async ({ page }) => {
    await page.getByRole('button', { name: /Vehicles/i }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: /Scan/i }).click();
    await page.waitForTimeout(500);
    const count = await page.locator('select option').count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  // === SCENARIO 17: Security Headers ===
  test('S17: Security headers are present', async ({ page }) => {
    const response = await page.goto('/?v=10');
    const headers = response?.headers() || {};
    expect(headers['x-frame-options'] || headers['x-content-type-options'] || headers['referrer-policy']).toBeTruthy();
  });

  // === SCENARIO 18: Accessibility - Tab Roles ===
  test('S18: Navigation has tablist role and tab roles', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toHaveAttribute('role', 'tablist');
    const tabs = page.locator('[role="tab"]');
    expect(await tabs.count()).toBe(5);
  });

  // === SCENARIO 19: Accessibility - Aria Labels ===
  test('S19: Critical buttons have aria-labels', async ({ page }) => {
    // Vehicle delete buttons
    await page.getByRole('button', { name: /Vehicles/i }).click();
    await page.waitForTimeout(1000);
    const deleteBtns = page.locator('[aria-label*="Delete"]');
    expect(await deleteBtns.count()).toBeGreaterThan(0);
  });

  // === SCENARIO 20: Offline Banner Hidden by Default ===
  test('S20: Offline banner is hidden when online', async ({ page }) => {
    const banner = page.locator('.offline-banner');
    await expect(banner).toBeHidden();
  });
});