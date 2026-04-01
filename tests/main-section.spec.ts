import {test, expect} from '@playwright/test'

test('main section renders hero content', async ({ page }) => {
  await page.goto('/')

  const section = page.locator('section#hello')
  await expect(section).toBeVisible()

  await expect(section.getByRole('heading', { name: 'Anthony Lombardi' })).toBeVisible()
  await expect(section.getByText('Lead Ruby Software Engineer')).toBeVisible()
  await expect(section.getByText('Westchester, New York')).toBeVisible()
})

test('main section CTA and avatar are available', async ({ page, isMobile }) => {
  await page.goto('/')

  const section = page.locator('section#hello')
  await expect(section.getByRole('link', { name: /resume/i })).toBeVisible()

  const avatar = section.locator('img[alt="Avatar"]')

  if (isMobile) {
    await expect(avatar).toHaveAttribute('alt', 'Avatar')
    return
  }

  await expect(avatar).toBeVisible()
})
