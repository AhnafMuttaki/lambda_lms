import { test, expect } from '@playwright/test'

// Responsive breakpoints
const breakpoints = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'tablet', width: 800, height: 1000 },
  { name: 'mobile', width: 375, height: 700 },
]

test.describe('LMS UI Responsiveness', () => {
  for (const bp of breakpoints) {
    test.describe(`${bp.name} layout`, () => {
      test(`Landing page displays course cards and sidebar (${bp.name})`, async ({ page }) => {
        await page.setViewportSize({ width: bp.width, height: bp.height })
        await page.goto('/')
        await expect(page.locator('.lms-sidebar')).toBeVisible()
        await expect(page.locator('.course-card')).toHaveCount(5)
        await expect(page.locator('.course-card .cta')).toBeVisible()
      })
      test(`Sidebar links are visible and clickable (${bp.name})`, async ({ page }) => {
        await page.setViewportSize({ width: bp.width, height: bp.height })
        await page.goto('/')
        await expect(page.locator('.lms-sidebar')).toBeVisible()
        await page.locator('.sidebar-link', { hasText: 'Courses' }).click()
        await expect(page).toHaveURL(/courses/)
      })
      test(`Login page is responsive (${bp.name})`, async ({ page }) => {
        await page.setViewportSize({ width: bp.width, height: bp.height })
        await page.goto('/login')
        await expect(page.locator('form')).toBeVisible()
        await expect(page.locator('input[type="email"]')).toBeVisible()
        await expect(page.locator('input[type="password"]')).toBeVisible()
        await expect(page.locator('.cta')).toBeVisible()
        await expect(page.locator('.switch-link')).toBeVisible()
      })
      test(`Register page is responsive (${bp.name})`, async ({ page }) => {
        await page.setViewportSize({ width: bp.width, height: bp.height })
        await page.goto('/register')
        await expect(page.locator('form')).toBeVisible()
        await expect(page.locator('input[type="text"]')).toBeVisible()
        await expect(page.locator('input[type="email"]')).toBeVisible()
        await expect(page.locator('input[type="password"]')).toBeVisible()
        await expect(page.locator('select')).toBeVisible()
        await expect(page.locator('.cta')).toBeVisible()
        await expect(page.locator('.switch-link')).toBeVisible()
      })
    })
  }
})
