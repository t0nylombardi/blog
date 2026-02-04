import { test, expect, devices } from '@playwright/test'

test('main section renders hero content', async ({ page }) => {
  await page.goto('/')

  const section = page.locator('section#hello')
  await expect(section).toBeVisible()

  await expect(section.getByRole('heading', { name: 'Anthony Lombardi' })).toBeVisible()
  await expect(section.getByText('Lead Ruby Software Engineer')).toBeVisible()
  await expect(section.getByText('Westchester, New York')).toBeVisible()
})

test('main section CTA and avatar are visible', async ({ page }) => {
  await page.goto('/')

  const section = page.locator('section#hello')
  await expect(section.getByRole('link', { name: /resume/i })).toBeVisible()
  await expect(section.getByRole('img', { name: 'Avatar' })).toBeVisible()
})
