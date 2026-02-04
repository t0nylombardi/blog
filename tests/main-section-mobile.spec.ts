

import { test, expect, devices } from '@playwright/test'

test.use({ ...devices['iPhone 14 Pro Max'] })
test.describe('mobile', () => {
  test('main section stacks and remains readable', async ({ page }) => {
    await page.goto('/')

    const section = page.locator('section#hello')
    await expect(section).toBeVisible()
    await expect(section).toHaveClass(/flex-col/)

    await expect(section.getByRole('heading', { name: 'Anthony Lombardi' })).toBeVisible()
    await expect(section.getByRole('link', { name: /resume/i })).toBeVisible()
  })
})
