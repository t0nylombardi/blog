import { test, expect } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3031'

test('home page loads and has site title', async ({ page }) => {
  await page.goto(`${baseURL}/`)
  await expect(page).toHaveTitle(/T0nylombardi/i)
})

test('nav renders on home page', async ({ page }) => {
  await page.goto(`${baseURL}/`)
  await expect(page.getByRole('link', { name: 'Anthony Lombardi' })).toBeVisible()
})

test('blog index renders header', async ({ page }) => {
  await page.goto(`${baseURL}/blog`)
  await expect(page.getByRole('heading', { name: '_blog' })).toBeVisible()
})

test('resume page renders primary heading', async ({ page }) => {
  await page.goto(`${baseURL}/resume`)
  await expect(page.getByRole('heading', { name: 'ANTHONY LOMBARDI' })).toBeVisible()
})

test('unknown route shows 404', async ({ page }) => {
  await page.goto(`${baseURL}/definitely-not-a-page`)
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
})
