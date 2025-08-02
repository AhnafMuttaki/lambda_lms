import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/register');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    await expect(page.getByText('Please select your role')).toBeVisible();
  });

  test('should show error for duplicate email', async ({ page }) => {
    // Replace with an email that already exists in the test DB
    await page.goto('/register');
    await page.fill('input#name', 'Test User');
    await page.fill('input#email', 'testuser@example.com');
    await page.fill('input#password', 'testpassword');
    await page.click('[data-testid="role-select"]');
    await page.click('text=Student');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Registration failed')).toBeVisible();
  });

  test('should register successfully with valid data', async ({ page }) => {
    const uniqueEmail = `testuser+${Date.now()}@example.com`;
    await page.goto('/register');
    await page.fill('input#name', 'Test User');
    await page.fill('input#email', uniqueEmail);
    await page.fill('input#password', 'testpassword');
    await page.click('[data-testid="role-select"]');
    await page.click('text=Student');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Account created successfully!')).toBeVisible();
  });
});
