import { test, expect } from '@playwright/test';

const randomEmail = () => `testuser_${Date.now()}@example.com`;

test.describe('Register Page', () => {
  test('should register a new user successfully', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input#name', 'Test User');
    await page.fill('input#email', randomEmail());
    await page.fill('input#password', 'TestPassword123');
    // Wait for the role dropdown to be visible and open it
    await page.waitForSelector('mat-select[formcontrolname="role"]', { state: 'visible' });
    await page.click('mat-select[formcontrolname="role"]');
    // Wait for the dropdown panel and select the option by text
    await page.waitForSelector('mat-option');
    await page.locator('mat-option').getByText('Student').click();
    await page.fill('input#company-confirm', 'Test Company');
    await page.check('mat-checkbox[formcontrolname="agreements"] input');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/confirmation-required/);
  });
});
