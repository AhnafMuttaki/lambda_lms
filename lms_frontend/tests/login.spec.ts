import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input#email', 'wrong@example.com');
    await page.fill('input#password', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Login failed')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Replace with a valid test user
    await page.goto('/login');
    await page.fill('input#email', 'testuser@example.com');
    await page.fill('input#password', 'testpassword');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Welcome back!')).toBeVisible();
  });
});
