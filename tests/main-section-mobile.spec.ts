
import {test, expect} from '@playwright/test'

test.describe('mobile', () => {
  test.skip(({isMobile}) => !isMobile, 'Requires a mobile project viewport')

  test('main section stacks and remains readable', async ({ page }) => {
    await page.goto('/')

    const section = page.locator('section#hello')
    await expect(section).toBeVisible()
    await expect(section).toHaveClass(/flex-col/)

    await expect(section.getByRole('heading', { name: 'Anthony Lombardi' })).toBeVisible()
    await expect(section.getByRole('link', { name: /resume/i })).toBeVisible()
  })
})
