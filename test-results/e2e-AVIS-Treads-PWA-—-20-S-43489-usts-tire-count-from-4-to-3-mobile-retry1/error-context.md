# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> AVIS Treads PWA — 20 Scenario Comprehensive Audit >> S11: Costs calculator adjusts tire count from 4 to 3
- Location: tests/e2e.spec.ts:129:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Decrease/i })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]: AVIS
        - generic [ref=e6]: Tread Intel
      - generic [ref=e9]: PWA
  - main [ref=e10]:
    - generic [ref=e12]:
      - heading "Replacement Cost" [level=2] [ref=e13]
      - generic [ref=e14]:
        - generic [ref=e15]:
          - text: Tire Grade
          - generic [ref=e16]:
            - button "Economy $85/tire Hyundai Venue, Kia Soul, Toyota Corolla" [ref=e17] [cursor=pointer]:
              - generic [ref=e18]: Economy
              - generic [ref=e19]: $85/tire
              - generic [ref=e20]: Hyundai Venue, Kia Soul, Toyota Corolla
            - button "Mid-Range $145/tire Toyota Camry, VW Jetta, Chevrolet Malibu" [ref=e21] [cursor=pointer]:
              - generic [ref=e22]: Mid-Range
              - generic [ref=e23]: $145/tire
              - generic [ref=e24]: Toyota Camry, VW Jetta, Chevrolet Malibu
            - button "Premium $220/tire Cadillac CT5, Lincoln Navigator, Mercedes C300" [ref=e25] [cursor=pointer]:
              - generic [ref=e26]: Premium
              - generic [ref=e27]: $220/tire
              - generic [ref=e28]: Cadillac CT5, Lincoln Navigator, Mercedes C300
            - button "SUV & Truck $185/tire Ford Explorer, GMC Yukon, Chevy Equinox" [ref=e29] [cursor=pointer]:
              - generic [ref=e30]: SUV & Truck
              - generic [ref=e31]: $185/tire
              - generic [ref=e32]: Ford Explorer, GMC Yukon, Chevy Equinox
        - generic [ref=e33]:
          - text: Number of Tires
          - generic [ref=e34]:
            - button "-" [ref=e35] [cursor=pointer]
            - generic [ref=e36]: "4"
            - button "+" [ref=e37] [cursor=pointer]
      - generic [ref=e38]:
        - heading "Estimate Summary" [level=3] [ref=e39]
        - generic [ref=e40]:
          - generic [ref=e41]:
            - generic [ref=e42]: Tires (4 x $145)
            - generic [ref=e43]: $580
          - generic [ref=e44]:
            - generic [ref=e45]: Mounting & Balance (4 x $30)
            - generic [ref=e46]: $120
          - generic [ref=e47]:
            - generic [ref=e48]: Estimated Tax (8%)
            - generic [ref=e49]: $56.00
          - generic [ref=e51]:
            - generic [ref=e52]: Total
            - generic [ref=e53]: $756.00
        - paragraph [ref=e54]: Estimates based on 2025 national average pricing. Actual costs vary by location, brand, and availability. Includes mounting, balancing, and valve stem.
    - navigation [ref=e55]:
      - generic [ref=e56]:
        - button "Scan" [ref=e57] [cursor=pointer]:
          - img [ref=e58]
          - generic [ref=e61]: Scan
        - button "History" [ref=e62] [cursor=pointer]:
          - img [ref=e63]
          - generic [ref=e66]: History
        - button "Fleet" [ref=e67] [cursor=pointer]:
          - img [ref=e68]
          - generic [ref=e71]: Fleet
        - button "Vehicles" [ref=e72] [cursor=pointer]:
          - img [ref=e73]
          - generic [ref=e77]: Vehicles
        - button "Costs" [active] [ref=e78] [cursor=pointer]:
          - img [ref=e79]
          - generic [ref=e81]: Costs
  - alert [ref=e82]
```

# Test source

```ts
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
  110 |     await page.waitForTimeout(1000);
  111 |     // Verify the new vehicle appears
  112 |     const body = await page.locator('main').textContent();
  113 |     expect(body).toContain('RAV4');
  114 |     expect(body).toContain('CO-AVS-5555');
  115 |   });
  116 | 
  117 |   // === SCENARIO 10: Delete Vehicle ===
  118 |   test('S10: Can delete a vehicle', async ({ page }) => {
  119 |     await page.getByRole('button', { name: /Vehicles/i }).click();
  120 |     await page.waitForTimeout(1000);
  121 |     const countBefore = await page.locator('main').locator('[aria-label*="Delete"]').count();
  122 |     if (countBefore > 0) {
  123 |       await page.locator('[aria-label*="Delete"]').first().click();
  124 |       await page.waitForTimeout(500);
  125 |     }
  126 |   });
  127 | 
  128 |   // === SCENARIO 11: Tire Count Adjustment ===
  129 |   test('S11: Costs calculator adjusts tire count from 4 to 3', async ({ page }) => {
  130 |     await page.getByRole('button', { name: /Costs/i }).click();
  131 |     await page.waitForTimeout(500);
> 132 |     await page.getByRole('button', { name: /Decrease/i }).click();
      |                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  133 |     await page.waitForTimeout(300);
  134 |     const body = await page.locator('main').textContent();
  135 |     expect(body).toContain('3');
  136 |   });
  137 | 
  138 |   // === SCENARIO 12: Export CSV ===
  139 |   test('S12: CSV export button works and triggers download', async ({ page }) => {
  140 |     await page.getByRole('button', { name: /Vehicles/i }).click();
  141 |     await page.waitForTimeout(1500);
  142 |     const csvBtn = page.getByRole('button', { name: /CSV/i });
  143 |     await expect(csvBtn).toBeVisible({ timeout: 3000 });
  144 |   });
  145 | 
  146 |   // === SCENARIO 13: Export JSON ===
  147 |   test('S13: JSON export button visible for Claude analysis', async ({ page }) => {
  148 |     await page.getByRole('button', { name: /Vehicles/i }).click();
  149 |     await page.waitForTimeout(1500);
  150 |     const jsonBtn = page.getByRole('button', { name: /JSON/i });
  151 |     await expect(jsonBtn).toBeVisible({ timeout: 3000 });
  152 |   });
  153 | 
  154 |   // === SCENARIO 14: Fleet Health Dashboard ===
  155 |   test('S14: Fleet dashboard shows pass/watch/fail counts', async ({ page }) => {
  156 |     await page.getByRole('button', { name: /Fleet/i }).click();
  157 |     await page.waitForTimeout(1500);
  158 |     await expect(page.getByText('Fleet Health')).toBeVisible({ timeout: 5000 });
  159 |     const pass = page.getByText(/Pass/i);
  160 |     const watch = page.getByText(/Watch/i);
  161 |     const fail = page.getByText(/Fail/i);
  162 |     expect(pass || watch || fail).toBeTruthy();
  163 |   });
  164 | 
  165 |   // === SCENARIO 15: History Tab Loads ===
  166 |   test('S15: History tab shows measurement data or empty state', async ({ page }) => {
  167 |     await page.getByRole('button', { name: /History/i }).click();
  168 |     await page.waitForTimeout(1000);
  169 |     const content = await page.locator('main').innerHTML();
  170 |     expect(content.length).toBeGreaterThan(50);
  171 |   });
  172 | 
  173 |   // === SCENARIO 16: Vehicle Selection Dropdown ===
  174 |   test('S16: Vehicle dropdown populates after navigating to Vehicles first', async ({ page }) => {
  175 |     await page.getByRole('button', { name: /Vehicles/i }).click();
  176 |     await page.waitForTimeout(1500);
  177 |     await page.getByRole('button', { name: /Scan/i }).click();
  178 |     await page.waitForTimeout(500);
  179 |     const count = await page.locator('select option').count();
  180 |     expect(count).toBeGreaterThanOrEqual(2);
  181 |   });
  182 | 
  183 |   // === SCENARIO 17: Security Headers ===
  184 |   test('S17: Security headers are present', async ({ page }) => {
  185 |     const response = await page.goto('/?v=10');
  186 |     const headers = response?.headers() || {};
  187 |     expect(headers['x-frame-options'] || headers['x-content-type-options'] || headers['referrer-policy']).toBeTruthy();
  188 |   });
  189 | 
  190 |   // === SCENARIO 18: Accessibility - Tab Roles ===
  191 |   test('S18: Navigation has tablist role and tab roles', async ({ page }) => {
  192 |     const nav = page.locator('nav');
  193 |     await expect(nav).toHaveAttribute('role', 'tablist');
  194 |     const tabs = page.locator('[role="tab"]');
  195 |     expect(await tabs.count()).toBe(5);
  196 |   });
  197 | 
  198 |   // === SCENARIO 19: Accessibility - Aria Labels ===
  199 |   test('S19: Critical buttons have aria-labels', async ({ page }) => {
  200 |     // Vehicle delete buttons
  201 |     await page.getByRole('button', { name: /Vehicles/i }).click();
  202 |     await page.waitForTimeout(1000);
  203 |     const deleteBtns = page.locator('[aria-label*="Delete"]');
  204 |     expect(await deleteBtns.count()).toBeGreaterThan(0);
  205 |   });
  206 | 
  207 |   // === SCENARIO 20: Offline Banner Hidden by Default ===
  208 |   test('S20: Offline banner is hidden when online', async ({ page }) => {
  209 |     const banner = page.locator('.offline-banner');
  210 |     await expect(banner).toBeHidden();
  211 |   });
  212 | });
```