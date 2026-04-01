import { test, expect } from '@playwright/test'

test('home page loads and has site title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/T0nylombardi/i)
})

test('nav renders on home page', async ({ page, isMobile }) => {
  await page.goto('/')

  if (isMobile) {
    await expect(page.locator('#hamburger')).toBeVisible()
    return
  }

  await expect(page.getByRole('link', {name: '_blog'})).toBeVisible()
  await expect(page.getByRole('link', {name: '_contact-me'})).toBeVisible()
})

test('blog index renders header', async ({ page }) => {
  await page.goto('/blog')
  await expect(page.getByRole('heading', { name: '_blog' })).toBeVisible()
})

test('resume page renders primary heading', async ({ page }) => {
  await page.goto('/resume')
  await expect(page.getByRole('heading', { name: 'ANTHONY LOMBARDI' })).toBeVisible()
})

test('unknown route shows 404', async ({ page }) => {
  await page.goto('/definitely-not-a-page')
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
})
