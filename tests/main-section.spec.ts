import {test, expect} from '@playwright/test'

test('main section renders hero content', async ({ page }) => {
  await page.goto('/')

  const section = page.locator('section#hello')
  await expect(section).toBeVisible()

  await expect(section.getByRole('heading', { name: 'Tony Lombardi' })).toBeVisible()
  const personalData = section.locator('pre')
  await expect(personalData).toContainText('const consultant = {')
  await expect(personalData).toContainText('Full-Stack & Systems Engineering')
  await expect(section.getByText('I help companies design, modernize, and scale production software.')).toBeVisible()
})

test('main section avatar is available', async ({ page, isMobile }) => {
  await page.goto('/')

  const section = page.locator('section#hello')

  const avatar = section.locator('img[alt="Avatar"]')

  if (isMobile) {
    await expect(avatar).toHaveAttribute('alt', 'Avatar')
    return
  }

  await expect(avatar).toBeVisible()
})
