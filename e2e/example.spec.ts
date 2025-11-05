import { test, expect } from '@playwright/test'

test.describe('Application', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Hands')
  })
})
