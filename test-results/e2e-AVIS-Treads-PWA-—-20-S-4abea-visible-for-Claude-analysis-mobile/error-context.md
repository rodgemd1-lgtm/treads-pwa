# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> AVIS Treads PWA — 20 Scenario Comprehensive Audit >> S13: JSON export button visible for Claude analysis
- Location: tests/e2e.spec.ts:147:7

# Error details

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('AVIS Treads PWA — 20 Scenario Comprehensive Audit', () => {
  4   | 
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await page.goto('/?v=10');
  7   |     await page.evaluate(() => localStorage.clear());
  8   |     await page.goto('/?v=10');
> 9   |     await page.waitForTimeout(2000);
      |                ^ Error: page.waitForTimeout: Target page, context or browser has been closed
  10  |   });
  11  | 
  12  |   // === SCENARIO 1: Brand & Identity ===
  13  |   test('S1: App loads with correct Avis branding and title', async ({ page }) => {
  14  |     await expect(page.locator('header')).toContainText('AVIS');
  15  |     await expect(page.locator('header')).toContainText('Tread Intel');
  16  |     await expect(page).toHaveTitle(/AVIS Tire Tread Intel/);
  17  |   });
  18  | 
  19  |   // === SCENARIO 2: Navigation ===
  20  |   test('S2: All 5 tabs present and navigate correctly', async ({ page }) => {
  21  |     for (const tab of ['Scan', 'History', 'Fleet', 'Vehicles', 'Costs']) {
  22  |       await page.getByRole('button', { name: new RegExp(tab, 'i') }).click();
  23  |       await page.waitForTimeout(300);
  24  |     }
  25  |     // Should end on Costs tab
  26  |     await expect(page.getByText('Replacement Cost')).toBeVisible({ timeout: 3000 });
  27  |   });
  28  | 
  29  |   // === SCENARIO 3: Fleet Data Loads ===
  30  |   test('S3: All 9 seeded vehicles load including James CR-V', async ({ page }) => {
  31  |     await page.getByRole('button', { name: /Vehicles/i }).click();
  32  |     await page.waitForTimeout(1500);
  33  |     const body = await page.locator('main').textContent();
  34  |     expect(body).toContain('Toyota Camry');
  35  |     expect(body).toContain('Honda CR-V');
  36  |     expect(body).toContain('CO-JL-2026');
  37  |   });
  38  | 
  39  |   // === SCENARIO 4: PWA Manifest Valid ===
  40  |   test('S4: PWA manifest has correct name, icons, and PNG format', async ({ page }) => {
  41  |     const response = await page.request.get('/manifest.json');
  42  |     const manifest = await response.json();
  43  |     expect(manifest.name).toBe('AVIS Tire Tread Intel');
  44  |     expect(manifest.short_name).toBe('AVIS Treads');
  45  |     expect(manifest.theme_color).toBe('#d4002a');
  46  |     expect(manifest.display).toBe('standalone');
  47  |     expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
  48  |     for (const icon of manifest.icons) {
  49  |       expect(icon.type).toBe('image/png');
  50  |     }
  51  |   });
  52  | 
  53  |   // === SCENARIO 5: Service Worker v3 ===
  54  |   test('S5: Service worker has v3 cache with network-first strategy', async ({ page }) => {
  55  |     const response = await page.request.get('/sw.js');
  56  |     const swContent = await response.text();
  57  |     expect(swContent).toContain('treads-v3');
  58  |     expect(swContent).toContain('network-first');
  59  |     expect(swContent).toContain('cache-first');
  60  |     expect(swContent).toContain('response.ok');
  61  |   });
  62  | 
  63  |   // === SCENARIO 6: Costs Calculator ===
  64  |   test('S6: Costs tab shows 2025 pricing with correct values', async ({ page }) => {
  65  |     await page.getByRole('button', { name: /Costs/i }).click();
  66  |     await page.waitForTimeout(1000);
  67  |     const body = await page.locator('main').textContent();
  68  |     expect(body).toContain('$85');
  69  |     expect(body).toContain('145');
  70  |     expect(body).toContain('220');
  71  |     expect(body).toContain('185');
  72  |     expect(body).toContain('Total');
  73  |   });
  74  | 
  75  |   // === SCENARIO 7: Responsive Mobile Layout ===
  76  |   test('S7: No horizontal overflow on 390px mobile viewport', async ({ page }) => {
  77  |     const width = await page.evaluate(() => document.documentElement.scrollWidth);
  78  |     expect(width).toBeLessThanOrEqual(420);
  79  |   });
  80  | 
  81  |   // === SCENARIO 8: Console Error Check ===
  82  |   test('S8: No critical console errors', async ({ page }) => {
  83  |     const errors: string[] = [];
  84  |     page.on('console', msg => {
  85  |       if (msg.type() === 'error') errors.push(msg.text());
  86  |     });
  87  |     await page.goto('/?v=10');
  88  |     await page.waitForTimeout(3000);
  89  |     const critical = errors.filter(e =>
  90  |       !e.includes('favicon') && !e.includes('camera') && !e.includes('NotAllowed') && !e.includes('NotFoundError')
  91  |     );
  92  |     expect(critical.length).toBeLessThan(3);
  93  |   });
  94  | 
  95  |   // === SCENARIO 9: Add Vehicle Form ===
  96  |   test('S9: Add vehicle with all fields including license plate', async ({ page }) => {
  97  |     await page.getByRole('button', { name: /Vehicles/i }).click();
  98  |     await page.waitForTimeout(500);
  99  |     await page.getByRole('button', { name: /Add/i }).click();
  100 |     await page.waitForTimeout(500);
  101 |     // Fill form fields
  102 |     await page.locator('#v-name').fill('Toyota RAV4 #5555');
  103 |     await page.locator('#v-make').fill('Toyota');
  104 |     await page.locator('#v-model').fill('RAV4');
  105 |     await page.locator('#v-year').fill('2024');
  106 |     await page.locator('#v-mileage').fill('15000');
  107 |     await page.locator('#v-plate').fill('CO-AVS-5555');
  108 |     // Submit
  109 |     await page.getByRole('button', { name: /Add Vehicle/i }).click();
```