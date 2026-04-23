# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> AVIS Treads PWA — 20 Scenario Comprehensive Audit >> S12: CSV export button works and triggers download
- Location: tests/e2e.spec.ts:139:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /CSV/i })
Expected: visible
Timeout: 3000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 3000ms
  - waiting for getByRole('button', { name: /CSV/i })

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
      - generic [ref=e13]:
        - heading "Fleet Vehicles" [level=2] [ref=e14]
        - button "Add" [ref=e15] [cursor=pointer]:
          - img [ref=e16]
          - text: Add
      - generic [ref=e17]:
        - generic [ref=e18]:
          - generic [ref=e19]:
            - generic [ref=e20]:
              - img [ref=e22]
              - generic [ref=e26]:
                - paragraph [ref=e27]: "Toyota Camry #1207"
                - paragraph [ref=e28]: Toyota Camry - CO-AVS-1207
            - button [ref=e29] [cursor=pointer]:
              - img [ref=e30]
          - generic [ref=e33]:
            - generic [ref=e34]: FL
            - generic [ref=e35]: FR
            - generic [ref=e36]: RL
            - generic [ref=e37]: RR
        - generic [ref=e38]:
          - generic [ref=e39]:
            - generic [ref=e40]:
              - img [ref=e42]
              - generic [ref=e46]:
                - paragraph [ref=e47]: "Chevrolet Equinox #0893"
                - paragraph [ref=e48]: Chevrolet Equinox - CO-AVS-0893
            - button [ref=e49] [cursor=pointer]:
              - img [ref=e50]
          - generic [ref=e53]:
            - generic [ref=e54]: FL
            - generic [ref=e55]: FR
            - generic [ref=e56]: RL
            - generic [ref=e57]: RR
        - generic [ref=e58]:
          - generic [ref=e59]:
            - generic [ref=e60]:
              - img [ref=e62]
              - generic [ref=e66]:
                - paragraph [ref=e67]: "Ford Explorer #1456"
                - paragraph [ref=e68]: Ford Explorer - CO-AVS-1456
            - button [ref=e69] [cursor=pointer]:
              - img [ref=e70]
          - generic [ref=e73]:
            - generic [ref=e74]: FL
            - generic [ref=e75]: FR
            - generic [ref=e76]: RL
            - generic [ref=e77]: RR
        - generic [ref=e78]:
          - generic [ref=e79]:
            - generic [ref=e80]:
              - img [ref=e82]
              - generic [ref=e86]:
                - paragraph [ref=e87]: "Hyundai Venue #2034"
                - paragraph [ref=e88]: Hyundai Venue - CO-AVS-2034
            - button [ref=e89] [cursor=pointer]:
              - img [ref=e90]
          - generic [ref=e93]:
            - generic [ref=e94]: FL
            - generic [ref=e95]: FR
            - generic [ref=e96]: RL
            - generic [ref=e97]: RR
        - generic [ref=e98]:
          - generic [ref=e99]:
            - generic [ref=e100]:
              - img [ref=e102]
              - generic [ref=e106]:
                - paragraph [ref=e107]: "Toyota Corolla #0678"
                - paragraph [ref=e108]: Toyota Corolla - CO-AVS-0678
            - button [ref=e109] [cursor=pointer]:
              - img [ref=e110]
          - generic [ref=e113]:
            - generic [ref=e114]: FL
            - generic [ref=e115]: FR
            - generic [ref=e116]: RL
            - generic [ref=e117]: RR
        - generic [ref=e118]:
          - generic [ref=e119]:
            - generic [ref=e120]:
              - img [ref=e122]
              - generic [ref=e126]:
                - paragraph [ref=e127]: "Cadillac XT6 #3012"
                - paragraph [ref=e128]: Cadillac XT6 - CO-AVS-3012
            - button [ref=e129] [cursor=pointer]:
              - img [ref=e130]
          - generic [ref=e133]:
            - generic [ref=e134]: FL
            - generic [ref=e135]: FR
            - generic [ref=e136]: RL
            - generic [ref=e137]: RR
        - generic [ref=e138]:
          - generic [ref=e139]:
            - generic [ref=e140]:
              - img [ref=e142]
              - generic [ref=e146]:
                - paragraph [ref=e147]: "Chrysler Pacifica #0567"
                - paragraph [ref=e148]: Chrysler Pacifica - CO-AVS-0567
            - button [ref=e149] [cursor=pointer]:
              - img [ref=e150]
          - generic [ref=e153]:
            - generic [ref=e154]: FL
            - generic [ref=e155]: FR
            - generic [ref=e156]: RL
            - generic [ref=e157]: RR
        - generic [ref=e158]:
          - generic [ref=e159]:
            - generic [ref=e160]:
              - img [ref=e162]
              - generic [ref=e166]:
                - paragraph [ref=e167]: "Tesla Model 3 #1789"
                - paragraph [ref=e168]: Tesla Model 3 - CO-AVS-1789
            - button [ref=e169] [cursor=pointer]:
              - img [ref=e170]
          - generic [ref=e173]:
            - generic [ref=e174]: FL
            - generic [ref=e175]: FR
            - generic [ref=e176]: RL
            - generic [ref=e177]: RR
        - generic [ref=e178]:
          - generic [ref=e179]:
            - generic [ref=e180]:
              - img [ref=e182]
              - generic [ref=e186]:
                - paragraph [ref=e187]: "Honda CR-V #4401"
                - paragraph [ref=e188]: Honda CR-V - CO-JL-2026
            - button [ref=e189] [cursor=pointer]:
              - img [ref=e190]
          - generic [ref=e193]:
            - generic [ref=e194]: FL
            - generic [ref=e195]: FR
            - generic [ref=e196]: RL
            - generic [ref=e197]: RR
    - navigation [ref=e198]:
      - generic [ref=e199]:
        - button "Scan" [ref=e200] [cursor=pointer]:
          - img [ref=e201]
          - generic [ref=e204]: Scan
        - button "History" [ref=e205] [cursor=pointer]:
          - img [ref=e206]
          - generic [ref=e209]: History
        - button "Fleet" [ref=e210] [cursor=pointer]:
          - img [ref=e211]
          - generic [ref=e214]: Fleet
        - button "Vehicles" [active] [ref=e215] [cursor=pointer]:
          - img [ref=e216]
          - generic [ref=e220]: Vehicles
        - button "Costs" [ref=e221] [cursor=pointer]:
          - img [ref=e222]
          - generic [ref=e224]: Costs
  - alert [ref=e225]
```

# Test source

```ts
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
  132 |     await page.getByRole('button', { name: /Decrease/i }).click();
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
> 143 |     await expect(csvBtn).toBeVisible({ timeout: 3000 });
      |                          ^ Error: expect(locator).toBeVisible() failed
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