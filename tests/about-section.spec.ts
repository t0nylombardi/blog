import { test, expect, devices } from '@playwright/test'

const mobileDevice = devices['iPhone 14 Pro Max']

test('about section renders header and copy', async ({ page }) => {
  await page.goto('/')

  const section = page.locator('section#about')
  await expect(section).toBeVisible()

  await expect(section.getByRole('heading', { name: '_about-me' })).toBeVisible()
  await expect(section.getByText('get a small overview of who I am')).toBeVisible()
})

test('about section shows bio text', async ({ page }) => {
  await page.goto('/')

  const section = page.locator('section#about')
  await expect(section.getByText(/self-taught/i)).toBeVisible()
})

test.describe('mobile', () => {
  test.use({
    viewport: mobileDevice.viewport,
    userAgent: mobileDevice.userAgent,
    deviceScaleFactor: mobileDevice.deviceScaleFactor,
    isMobile: mobileDevice.isMobile,
    hasTouch: mobileDevice.hasTouch,
  })

  test('about section stacks and hides sprites', async ({ page }) => {
    await page.goto('/')

    const section = page.locator('section#about')
    await expect(section).toBeVisible()
    await expect(section).toHaveClass(/flex-col-reverse/)

    const sprites = section.locator('div').first()
    await expect(sprites).toBeHidden()
  })
})
